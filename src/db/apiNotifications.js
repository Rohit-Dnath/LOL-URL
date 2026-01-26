import supabase from "./supabase";

// Get user notifications
export async function getNotifications(user_id) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching notifications:", error);
    throw new Error("Unable to load notifications");
  }

  return data;
}

// Get unread notification count
export async function getUnreadCount(user_id) {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", user_id)
    .eq("read", false);

  if (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }

  return count || 0;
}

// Mark notification as read
export async function markNotificationRead(notification_id) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notification_id);

  if (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Unable to mark notification as read");
  }
}

// Mark all notifications as read
export async function markAllNotificationsRead(user_id) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user_id)
    .eq("read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Unable to mark all notifications as read");
  }
}

// Delete notification
export async function deleteNotification(notification_id) {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notification_id);

  if (error) {
    console.error("Error deleting notification:", error);
    throw new Error("Unable to delete notification");
  }
}

// Create notification (for manual testing or admin use)
export async function createNotification({ user_id, type, message, data }) {
  const { error } = await supabase
    .from("notifications")
    .insert([{ user_id, type, message, data }]);

  if (error) {
    console.error("Error creating notification:", error);
    throw new Error("Unable to create notification");
  }
}

// Subscribe to real-time notifications
export function subscribeToNotifications(user_id, callback) {
  const subscription = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user_id}`
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return subscription;
}

// Unsubscribe from notifications
export function unsubscribeFromNotifications(subscription) {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
}
