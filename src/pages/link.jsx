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
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import confetti from "canvas-confetti";
import { Confetti } from "@/components/ui/confetti";
import { AutoConfetti } from "@/components/ui/auto-confetti";

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
    navigator.clipboard.writeText(`${DOMAIN}/${link}`);
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
  const [searchParams] = useSearchParams();
  const isNewLink = searchParams.get('new') === 'true';
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

  const engagementData = stats?.map(stat => ({
    time: new Date(stat.created_at).toLocaleTimeString(),
    clicks: 1,
  }));

  return (
    <>
      {isNewLink && <AutoConfetti />}
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover style={{ zIndex: 9999 }} />
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#8884d8" />
      )}
      <br />
      <br />

      
      <div className="flex flex-col gap-4 max-w-full">
        <Card className="bg-background p-4 sm:p-6">
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-8">
              <div className="flex flex-col items-start gap-4 sm:gap-6 w-full sm:w-3/5">
                <span className="text-3xl sm:text-4xl md:text-6xl font-extrabold hover:underline cursor-pointer break-words w-full">
                  {url?.title}
                </span>
                <a
                  href={`${DOMAIN}/${link}`}
                  target="_blank"
                  className="text-xl sm:text-2xl md:text-3xl text-blue-400 font-bold hover:underline cursor-pointer break-all w-full"
                >
                  {DOMAIN}/{link}
                </a>
                <a
                  href={url?.original_url}
                  target="_blank"
                  className="flex items-start gap-1 hover:underline cursor-pointer break-all w-full"
                >
                  <LinkIcon className="p-1 min-w-[24px]" />
                  <span className="break-all">{url?.original_url}</span>
                </a>
                <span className="flex items-end font-extralight text-sm w-full break-words">
                  {new Date(url?.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col items-center self-center sm:self-start mt-4 sm:mt-0">
                <img
                  src={qrCodeUrl}
                  className="w-32 h-32 sm:w-40 sm:h-40 p-1 object-contain"
                  alt="qr code"
                />
                <div className="flex gap-2 mt-4">
                  <Button variant="ghost" onClick={handleCopy}>
                    <Copy />
                  </Button>
                  <Button variant="ghost" onClick={downloadImage}>
                    <Download />
                  </Button>
                  <Button variant="ghost" onClick={handleDelete} disable={loadingDelete}>
                    {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded bg-background">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-2xl sm:text-4xl font-extrabold break-words">Statistics</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
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
                <div className="sm:w-1/2 border p-4 rounded pointer-events-none">
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
                  <DeviceStats stats={stats} className="text-sm "/>
                </div>
              </div>
              <div className="w-full border p-4 rounded ">
                <CardTitle className="mb-8">Engagement Timings</CardTitle>
                <div className="w-full overflow-x-auto">
                  <LineChart
                    width={Math.max(window.innerWidth - 64, 500)} // Ensure minimum width of 500
                    height={300}
                    data={engagementData}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </div>
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-4 sm:p-6">
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