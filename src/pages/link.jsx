import DeviceStats from "@/components/device-stats";
import Location from "@/components/location-stats";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import {UrlState} from "@/context";
import {getClicksForUrl} from "@/db/apiClicks";
import {deleteUrl, getUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {Copy, Download, LinkIcon, Trash, Share2} from "lucide-react";
import {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell } from 'recharts';
import confetti from "canvas-confetti";
import { Confetti } from "@/components/ui/confetti";
import { AutoConfetti } from "@/components/ui/auto-confetti";
import { toastConfig } from "@/utils/toastConfig";
import { generateSocialPreviewImage, downloadSocialPreview } from "@/utils/socialPreview";

const LinkPage = () => {
  const DOMAIN = window.location.origin;
  const [isGeneratingSocialPreview, setIsGeneratingSocialPreview] = useState(false);
  
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

    toast.success("Image downloaded successfully!", toastConfig);
  };

  const handleSocialPreview = async () => {
    if (!url) return;
    
    setIsGeneratingSocialPreview(true);
    try {
      const success = await downloadSocialPreview(url, `${url.title}_social_preview.png`);
      if (success) {
        toast.success("Social preview downloaded successfully!", toastConfig);
      } else {
        toast.error("Failed to generate social preview", toastConfig);
      }
    } catch (error) {
      console.error('Error generating social preview:', error);
      toast.error("Failed to generate social preview", toastConfig);
    } finally {
      setIsGeneratingSocialPreview(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/${link}`);
    toast.success("URL copied to clipboard!", toastConfig);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this URL?");
    if (!confirmDelete) return;
    try {
      await fnDelete();
      navigate("/dashboard", { state: { showDeleteToast: true } });
    } catch (error) {
      toast.error("Failed to delete URL.", toastConfig);
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

  useEffect(() => {
    if (isNewLink) {
      const duration = 3 * 1000; // Reduced duration to 3 seconds
      const end = Date.now() + duration;

      (function frame() {
        // Random position for firework-like effect
        const x = Math.random();
        const y = Math.random() * 0.5;

        confetti({
          particleCount: 15, // Reduced particle count
          spread: 40,
          origin: { x, y },
          gravity: 0.8, // Higher gravity for faster fall
          scalar: 0.9, // Slightly smaller particles
          ticks: 200, // Reduced ticks for shorter trails
          startVelocity: 25, // Reduced initial velocity
        });

        if (Date.now() < end) {
          setTimeout(frame, 250); // Add delay between bursts
        } else {
          navigate(`/link/${id}`, { replace: true });
        }
      }());
    }
  }, [isNewLink, id, navigate]);

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

  // Add this new data transformation for country visits
  const countryVisitsData = stats?.reduce((acc, stat) => {
    if (stat.country) {
      acc[stat.country] = (acc[stat.country] || 0) + 1;
    }
    return acc;
  }, {});

  // Update the countryChartData transformation to limit to top 10 countries
  const countryChartData = Object.entries(countryVisitsData || {})
    .map(([country, visits]) => ({
      country,
      visits
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10); // Show only top 10 countries

  // Define static colors for the bars
  const CHART_COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c',
    '#d0ed57', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'
  ];

  return (
    <>
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <ScrollProgress />
      {isNewLink && <AutoConfetti />}
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
                  href={`${window.location.origin}/${link}`}
                  target="_blank"
                  className="text-xl sm:text-2xl md:text-3xl text-blue-400 font-bold hover:underline cursor-pointer break-all w-full"
                >
                  {window.location.origin}/{link}
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
                  <Button 
                    variant="ghost" 
                    onClick={handleSocialPreview}
                    disabled={isGeneratingSocialPreview}
                    title="Generate Social Media Preview"
                  >
                    {isGeneratingSocialPreview ? <BeatLoader size={5} color="white" /> : <Share2 />}
                  </Button>
                  <Button variant="ghost" onClick={handleDelete} disable={loadingDelete}>
                    {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Preview Section */}
        <Card className="rounded bg-background">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-2xl sm:text-4xl font-extrabold break-words">Social Media Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Generate Social Media Preview</h3>
                <p className="text-gray-400">
                  Create a professional social media preview image for sharing your link on Twitter, Facebook, LinkedIn, and other platforms.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Optimized for all major social platforms</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Includes QR code for easy access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Professional gradient design</span>
                  </div>
                </div>
                <Button 
                  onClick={handleSocialPreview}
                  disabled={isGeneratingSocialPreview}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGeneratingSocialPreview ? 'Generating...' : 'Generate & Download Preview'}
                </Button>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preview Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                    <span className="text-sm">Dimensions</span>
                    <span className="text-sm font-mono">1200 × 630 px</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                    <span className="text-sm">Format</span>
                    <span className="text-sm font-mono">PNG</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded">
                    <span className="text-sm">Optimized for</span>
                    <span className="text-sm">Twitter, Facebook, LinkedIn</span>
                  </div>
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
                  <CardTitle className="mb-10">Location Insights</CardTitle>
                  <Location stats={stats} />
                </div>
                <div className="sm:w-1/2 border p-4 rounded pointer-events-none">
                  <CardTitle className="mb-3">Device Details</CardTitle>
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
              <div className="flex flex-col sm:flex-row gap-8">
                <div className="sm:w-3/5 border p-4 rounded">
                  <CardTitle className="mb-8">User Active Time</CardTitle>
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
                <div className="sm:w-2/5 border p-4 rounded pointer-events-none">
                  <CardTitle className="mb-8">Visitor Countries</CardTitle>
                  <div className="w-full overflow-x-auto ">
                    <BarChart
                      width={300}
                      height={350}
                      data={countryChartData}
                      margin={{
                        top: 20,
                        right: 20,
                        left: 60,
                        bottom: 5
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="country" />
                      <YAxis />
                      <Tooltip 
                        cursor={{fill: 'rgba(136, 132, 216, 0.1)'}}
                        contentStyle={{
                          backgroundColor: '#1e1e1e',
                          border: '1px solid #333'
                        }}
                      />
                      <Bar 
                        dataKey="visits" 
                        label={{ position: 'top' }}
                        radius={[4, 4, 0, 0]}
                        name=" "  // Empty name to remove legend text
                      >
                        {
                          countryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </div>
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