import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import {UrlState} from "@/context";
import {getClicksForUrl} from "@/db/apiClicks";
import {deleteUrl, getUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {Copy, Download, LinkIcon, Trash} from "lucide-react";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LinkPage = () => {
  const DOMAIN = import.meta.env.VITE_YOUR_DOMAIN;
  const downloadImage = async () => {
    const imageUrl = url?.qr;
    const fileName = `${url?.title}_qr`;

    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(objectUrl);

    toast.success("Image downloaded successfully!", {
      position: "top-right",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://urll.lol/${link}`);
    toast.success("URL copied to clipboard!", {
      position: "top-right",
    });
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this URL?");
    if (!confirmDelete) return;
    try {
      await fnDelete();
      navigate("/dashboard");
      toast.success("URL deleted successfully!", {
        position: "top-right",
      });
    } catch (error) {
      toast.error("Failed to delete URL.", {
        position: "top-right",
      });
    }
  };

  const navigate = useNavigate();
  const {user} = UrlState();
  const {id} = useParams();
  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, {id, user_id: user?.id});

  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const {loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  const qrCodeUrl = url?.qr || "fallback-image-url"; // Add a fallback image URL if needed

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover style={{ zIndex: 9999 }} />
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <br />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
          <div className="flex flex-col items-start gap-8 sm:w-3/5">
            <span className="text-6xl font-extrabold hover:underline cursor-pointer">
              {url?.title}
            </span>
            <a
              href={`${DOMAIN}/${link}`}
              target="_blank"
              className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
            >
              {DOMAIN}/{link}
            </a>
            <a
              href={url?.original_url}
              target="_blank"
              className="flex items-center gap-1 hover:underline cursor-pointer"
            >
              <LinkIcon className="p-1" />
              {url?.original_url}
            </a>
            <span className="flex items-end font-extralight text-sm">
              {new Date(url?.created_at).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src={qrCodeUrl}
              className="w-32 h-32 sm:w-40 sm:h-40 ring ring-blue-500 p-1 object-contain"
              alt="qr code"
            />
            <div className="flex gap-2 mt-4">
              <Button variant="ghost" onClick={handleCopy}>
                <Copy />
              </Button>
              <Button variant="ghost" onClick={downloadImage}>
                <Download />
              </Button>
              <Button
                variant="ghost"
                onClick={handleDelete}
                disable={loadingDelete}
              >
                {loadingDelete ? (
                  <BeatLoader size={5} color="white" />
                ) : (
                  <Trash />
                )}
              </Button>
            </div>
          </div>
        </div>

        <Card className="rounded bg-background">
          <CardHeader >
            <CardTitle className="text-4xl font-extrabold">Statistics</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card className="bg-background rounded">
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>
              <ScrollProgress className="w-full" />

              <div className="flex flex-col sm:flex-row gap-8">
                <div className="sm:w-1/2 border p-4 rounded">
                  <CardTitle className="mb-10">Location Data</CardTitle>
                  <Location stats={stats} />
                </div>
                <div className="sm:w-1/2 border p-4 rounded">
                  <CardTitle className="mb-3">Device Info</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500"></div>
                      <span>Desktop</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500"></div>
                      <span>Mobile</span>
                    </div>
                  </div>
                  <DeviceStats stats={stats} className="text-sm"/>
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default LinkPage;