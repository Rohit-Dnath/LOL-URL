import supabase, {supabaseUrl} from "./supabase";

export async function getUrls(user_id, workspace_id = null) {
  let query = supabase
    .from("urls")
    .select("*");

  if (workspace_id) {
    // Get workspace URLs
    query = query.eq("workspace_id", workspace_id);
  } else {
    // Get personal URLs (no workspace)
    query = query.eq("user_id", user_id).is("workspace_id", null);
  }

  let {data, error} = await query;

  if (error) {
    console.error('Error fetching URLs:', error);
    throw new Error("Unable to load URLs");
  }

  return data;
}

export async function getUrl({id, user_id}) {
  // First try to get the URL by id (RLS will handle access control)
  const {data, error} = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching URL:", error);
    throw new Error("Short Url not found");
  }

  return data;
}

export async function getLongUrl(id) {
  let {data: shortLinkData, error: shortLinkError} = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    console.error("Error fetching short link:", shortLinkError);
    return;
  }

  return shortLinkData;
}

export async function createUrl({title, longUrl, customUrl, user_id, workspace_id = null}, qrcode) {
  const short_url = Math.random().toString(36).substring(2, 6);
  const fileName = `qr-${customUrl || short_url}`;

  const {error: storageError} = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  if (storageError) {
    console.error('Storage error:', storageError);
    throw new Error(storageError.message);
  }

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const {data, error} = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        workspace_id: workspace_id || null,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error('Database error:', error);
    throw new Error("Error creating short URL");
  }

  return data;
}

export async function deleteUrl(id) {
  const {data, error} = await supabase.from("urls").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Unable to delete Url");
  }

  return data;
}

export async function checkCustomUrlExists(customUrl) {
  // Check if the custom URL exists in either custom_url or short_url columns
  const {data, error} = await supabase
    .from("urls")
    .select("id")
    .or(`custom_url.eq.${customUrl},short_url.eq.${customUrl}`)
    .maybeSingle();

  if (error) {
    console.error("Error checking custom URL:", error);
    throw new Error("Error checking custom URL");
  }

  // Return true if URL exists (data is not null), false otherwise
  return data !== null;
}