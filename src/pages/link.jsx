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
import {useEffect, useState} from "react";
import React from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {BarLoader, BeatLoader} from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import confetti from "canvas-confetti";
import { Confetti } from "@/components/ui/confetti";
import { AutoConfetti } from "@/components/ui/auto-confetti";
import { toastConfig } from "@/utils/toastConfig";

const LinkPage = () => {
  const DOMAIN = window.location.origin;
  const [showAllCountries, setShowAllCountries] = useState(false);

  // Helper function to get country code for flag
  const getCountryCode = (countryName) => {
    const countryMap = {
      'India': 'IN',
      'United States': 'US',
      'United States of America': 'US',
      'United Kingdom': 'GB',
      'Canada': 'CA',
      'Australia': 'AU',
      'Germany': 'DE',
      'France': 'FR',
      'Japan': 'JP',
      'China': 'CN',
      'Brazil': 'BR',
      'Mexico': 'MX',
      'Spain': 'ES',
      'Italy': 'IT',
      'Netherlands': 'NL',
      'Belgium': 'BE',
      'Switzerland': 'CH',
      'Austria': 'AT',
      'Sweden': 'SE',
      'Norway': 'NO',
      'Denmark': 'DK',
      'Finland': 'FI',
      'Poland': 'PL',
      'Czech Republic': 'CZ',
      'Hungary': 'HU',
      'Romania': 'RO',
      'Bulgaria': 'BG',
      'Croatia': 'HR',
      'Slovakia': 'SK',
      'Slovenia': 'SI',
      'Lithuania': 'LT',
      'Latvia': 'LV',
      'Estonia': 'EE',
      'Ireland': 'IE',
      'Portugal': 'PT',
      'Greece': 'GR',
      'Turkey': 'TR',
      'Russia': 'RU',
      'Ukraine': 'UA',
      'Belarus': 'BY',
      'Israel': 'IL',
      'United Arab Emirates': 'AE',
      'Saudi Arabia': 'SA',
      'South Africa': 'ZA',
      'Egypt': 'EG',
      'Nigeria': 'NG',
      'Kenya': 'KE',
      'Morocco': 'MA',
      'Algeria': 'DZ',
      'Tunisia': 'TN',
      'South Korea': 'KR',
      'North Korea': 'KP',
      'Thailand': 'TH',
      'Vietnam': 'VN',
      'Malaysia': 'MY',
      'Singapore': 'SG',
      'Indonesia': 'ID',
      'Philippines': 'PH',
      'Pakistan': 'PK',
      'Bangladesh': 'BD',
      'Sri Lanka': 'LK',
      'Nepal': 'NP',
      'Myanmar': 'MM',
      'Cambodia': 'KH',
      'Laos': 'LA',
      'Argentina': 'AR',
      'Chile': 'CL',
      'Colombia': 'CO',
      'Peru': 'PE',
      'Venezuela': 'VE',
      'Ecuador': 'EC',
      'Uruguay': 'UY',
      'Paraguay': 'PY',
      'Bolivia': 'BO',
      'New Zealand': 'NZ',
      'Côte d\'Ivoire': 'CI',
      'Cote D\'Ivoire': 'CI'
    };
    return countryMap[countryName] || null;
  };
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

  // Enhanced engagement data with time gaps and cumulative clicks
  const engagementData = React.useMemo(() => {
    if (!stats || stats.length === 0) return [];

    // Group clicks by hour and date
    const clicksByHour = stats.reduce((acc, stat) => {
      const date = new Date(stat.created_at);
      const hour = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
      const hourKey = hour.getTime();
      
      acc[hourKey] = (acc[hourKey] || 0) + 1;
      return acc;
    }, {});

    // Get the time range from first click to now
    const sortedStats = [...stats].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    const firstClick = new Date(sortedStats[0].created_at);
    const lastClick = new Date(sortedStats[sortedStats.length - 1].created_at);
    const now = new Date();
    
    // Start from the hour of first click
    const startHour = new Date(firstClick.getFullYear(), firstClick.getMonth(), firstClick.getDate(), firstClick.getHours());
    // End at current hour or last click hour, whichever is later
    const endHour = new Date(Math.max(lastClick.getTime(), now.getTime()));
    endHour.setMinutes(0, 0, 0); // Round to hour

    const timelineData = [];
    let currentHour = new Date(startHour);
    let cumulativeClicks = 0;

    while (currentHour <= endHour) {
      const hourKey = currentHour.getTime();
      const clicksInHour = clicksByHour[hourKey] || 0;
      cumulativeClicks += clicksInHour;

      timelineData.push({
        time: currentHour.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric',
          hour12: true 
        }),
        fullTime: currentHour.toLocaleString(),
        clicks: clicksInHour,
        totalClicks: cumulativeClicks,
        hasData: clicksInHour > 0
      });

      // Move to next hour
      currentHour = new Date(currentHour.getTime() + 60 * 60 * 1000);
    }

    return timelineData;
  }, [stats]);

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
                  <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={engagementData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis 
                          dataKey="time" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={11}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={Math.max(1, Math.floor(engagementData?.length / 8) || 1)}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          allowDecimals={false}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                          }}
                          labelFormatter={(label, payload) => {
                            if (payload && payload[0]) {
                              return `Time: ${payload[0].payload.fullTime}`;
                            }
                            return `Time: ${label}`;
                          }}
                          formatter={(value, name) => {
                            if (name === 'clicks') {
                              return [value === 0 ? 'No clicks' : `${value} click${value !== 1 ? 's' : ''}`, 'Clicks in this hour'];
                            }
                            if (name === 'totalClicks') {
                              return [`${value} total`, 'Cumulative Clicks'];
                            }
                            return [value, name];
                          }}
                        />
                        
                        {/* Hourly clicks line */}
                        <Line 
                          type="monotone" 
                          dataKey="clicks" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={(props) => {
                            const { cx, cy, payload } = props;
                            if (payload?.hasData) {
                              return (
                                <circle 
                                  cx={cx} 
                                  cy={cy} 
                                  r={4} 
                                  fill="hsl(var(--primary))" 
                                  stroke="hsl(var(--background))" 
                                  strokeWidth={2}
                                />
                              );
                            }
                            return (
                              <circle 
                                cx={cx} 
                                cy={cy} 
                                r={2} 
                                fill="hsl(var(--muted-foreground))" 
                                opacity={0.3}
                              />
                            );
                          }}
                          activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                          connectNulls={false}
                        />
                        
                        {/* Cumulative clicks line */}
                        <Line 
                          type="monotone" 
                          dataKey="totalClicks" 
                          stroke="hsl(var(--secondary))" 
                          strokeWidth={1.5}
                          strokeDasharray="5 5"
                          dot={false}
                          activeDot={{ r: 4, fill: "hsl(var(--secondary))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 bg-primary"></div>
                      <span className="text-muted-foreground">Hourly Clicks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-0.5 border-b-2 border-dashed border-secondary"></div>
                      <span className="text-muted-foreground">Cumulative Total</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Country Visits Chart */}
              <Card className="bg-muted/20 border border-border">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-lg font-semibold text-foreground">Countries</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {countryChartData && countryChartData.length > 0 ? (
                    <div className="space-y-4">
                      {/* Country List */}
                      <div className="space-y-2">
                        {countryChartData.slice(0, showAllCountries ? countryChartData.length : 8).map((country, index) => {
                          const percentage = ((country.visits / stats.length) * 100).toFixed(1);
                          const countryCode = getCountryCode(country.country);
                          
                          return (
                            <div key={country.country} className="flex items-center justify-between py-3 px-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors border border-border/50">
                              {/* Left side: Rank, Flag, Country */}
                              <div className="flex items-center gap-3 flex-1">
                                {/* Rank Badge */}
                                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                
                                {/* Flag */}
                                <div className="w-8 h-5 flex items-center justify-center">
                                  {countryCode && (
                                    <img 
                                      src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
                                      alt={`${country.country} flag`}
                                      className="w-full h-full object-cover rounded-sm shadow-sm"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  )}
                                </div>
                                
                                {/* Country Name */}
                                <span className="text-foreground font-medium text-sm min-w-0 flex-1">
                                  {country.country}
                                </span>
                              </div>
                              
                              {/* Right side: Percentage and Visits */}
                              <div className="flex items-center gap-6">
                                {/* Percentage */}
                                <span className="text-primary text-sm font-medium">
                                  {percentage}% of traffic
                                </span>
                                
                                {/* Visit Count */}
                                <div className="text-right">
                                  <div className="text-foreground text-lg font-bold">
                                    {country.visits}
                                  </div>
                                  <div className="text-muted-foreground text-xs">
                                    visits
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* View All Button */}
                      {countryChartData.length > 8 && (
                        <div className="pt-4 border-t border-border">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full hover:bg-muted/50 transition-colors"
                            onClick={() => setShowAllCountries(!showAllCountries)}
                          >
                            {showAllCountries ? (
                              <>Show Less</>
                            ) : (
                              <>View All {countryChartData.length} Countries</>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <div className="text-lg font-medium mb-2">No country data available yet</div>
                      <div className="text-sm">Share your link to start collecting visitor data!</div>
                    </div>
                  )}
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