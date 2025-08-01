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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import confetti from "canvas-confetti";
import { Confetti } from "@/components/ui/confetti";
import { AutoConfetti } from "@/components/ui/auto-confetti";
import { toastConfig } from "@/utils/toastConfig";

const LinkPage = () => {
  const DOMAIN = window.location.origin;
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

  return (
    <>
      <ToastContainer {...toastConfig} />
      <ScrollProgress />
      {isNewLink && <AutoConfetti />}
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="hsl(var(--primary))" />
      )}

      <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4">
        {/* Main Link Card - Redesigned */}
        <Card className="bg-background border-2 border-border shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Left Section - Link Info */}
              <div className="lg:col-span-2 p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h1 className="text-2xl lg:text-4xl font-bold text-foreground leading-tight break-words">
                      {url?.title}
                    </h1>
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCopy}
                        className="border-border hover:bg-muted transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={downloadImage}
                        className="border-border hover:bg-muted transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleDelete} 
                        disabled={loadingDelete}
                        className="hover:bg-destructive/90 transition-colors"
                      >
                        {loadingDelete ? <BeatLoader size={5} color="currentColor" /> : <Trash className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Short URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Short URL</label>
                    <a
                      href={`${window.location.origin}/${link}`}
                      target="_blank"
                      className="block text-lg lg:text-xl font-semibold text-primary hover:text-primary/80 transition-colors break-all"
                    >
                      {window.location.origin}/{link}
                    </a>
                  </div>

                  {/* Original URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Original URL</label>
                    <a
                      href={url?.original_url}
                      target="_blank"
                      className="flex items-start gap-2 text-foreground hover:text-primary transition-colors break-all group"
                    >
                      <LinkIcon className="w-4 h-4 mt-1 flex-shrink-0 group-hover:text-primary transition-colors" />
                      <span className="break-all">{url?.original_url}</span>
                    </a>
                  </div>

                  {/* Creation Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(url?.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section - QR Code */}
              <div className="bg-muted/30 border-l border-border p-6 lg:p-8 flex flex-col items-center justify-center space-y-4">
                <div className="bg-background p-4 border border-border shadow-sm">
                  <img
                    src={qrCodeUrl}
                    className="w-32 h-32 lg:w-40 lg:h-40 object-contain"
                    alt="QR Code"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan to visit link
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Section - Redesigned */}
        <Card className="bg-background border-2 border-border shadow-lg">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-2xl font-bold text-foreground">Analytics & Statistics</CardTitle>
          </CardHeader>
          
          {stats && stats.length ? (
            <CardContent className="p-6 space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-muted/30 border border-border">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stats?.length}</div>
                    <div className="text-sm font-medium text-muted-foreground">Total Clicks</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/30 border border-border">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {new Set(stats?.map(stat => stat.country)).size}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Countries</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/30 border border-border">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {new Set(stats?.map(stat => stat.device)).size}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Device Types</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Location Analytics */}
                <Card className="bg-muted/20 border border-border">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg font-semibold text-foreground">Geographic Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Location stats={stats} />
                  </CardContent>
                </Card>

                {/* Device Analytics */}
                <Card className="bg-muted/20 border border-border">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg font-semibold text-foreground">Device Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <DeviceStats stats={stats} />
                  </CardContent>
                </Card>
              </div>

              {/* Engagement Chart */}
              <Card className="bg-muted/20 border border-border">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-lg font-semibold text-foreground">Click Timeline</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="w-full h-[300px]">
                    <LineChart
                      width={window.innerWidth > 1024 ? 800 : window.innerWidth - 200}
                      height={300}
                      data={engagementData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                          color: "hsl(var(--foreground))"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </div>
                </CardContent>
              </Card>

              {/* Country Visits Chart */}
              <Card className="bg-muted/20 border border-border">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-lg font-semibold text-foreground">Top Visiting Countries</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="w-full h-[350px]">
                    <BarChart
                      width={window.innerWidth > 1024 ? 800 : window.innerWidth - 200}
                      height={350}
                      data={countryChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="country" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={10}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1e1e1e',
                          border: '1px solid #333'
                        }}
                      />
                      <Bar 
                        dataKey="visits" 
                        fill="hsl(var(--primary))"
                        name="Visits"
                      />
                    </BarChart>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          ) : (
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                {loadingStats === false
                  ? "No analytics data available yet. Share your link to start collecting statistics!"
                  : "Loading analytics data..."}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default LinkPage;