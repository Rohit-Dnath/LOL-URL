import { CreateLink } from "@/components/create-link";
import LinkCard from "@/components/link-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { UrlState } from "@/context";
import { getClicksForUrls } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { ToastContainer, toast } from "react-toastify";
import { toastConfig } from "@/utils/toastConfig";
import { useLocation } from "react-router-dom";
import { Filter, Calendar, MousePointer } from "lucide-react";

const ITEMS_PER_PAGE = 6; // Number of links per page

const Dashboard = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // For date filtering
  const [clickFilter, setClickFilter] = useState("all"); // For click filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [chartType, setChartType] = useState("bar"); // New state for chart type
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minClicks, setMinClicks] = useState("");
  const [maxClicks, setMaxClicks] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  const { user } = UrlState();
  const { loading, data: urls, fn: fnUrls } = useFetch(getUrls, user.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (location.state?.showDeleteToast) {
      toast.success("URL deleted successfully!", toastConfig);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Improved filtering logic with null safety
  const filteredUrls = urls
    ?.filter((url) => {
      // Search filter
      if (searchQuery && url.title) {
        return url.title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter((url) => {
      // Date range filter
      if (startDate || endDate) {
        if (!url.created_at) return false;
        const urlDate = new Date(url.created_at).toISOString().slice(0, 10);
        
        if (startDate && urlDate < startDate) return false;
        if (endDate && urlDate > endDate) return false;
        return true;
      }
      
      // Single date filter (legacy)
      if (dateFilter) {
        if (!url.created_at) return false;
        return new Date(url.created_at).toISOString().slice(0, 10) === dateFilter;
      }
      
      return true;
    })
    .filter((url) => {
      // Click filters
      const urlClicks = clicks?.filter((c) => c.url_id === url.id).length || 0;
      
      // Custom range filter
      if (minClicks !== "" || maxClicks !== "") {
        const min = minClicks ? parseInt(minClicks) : 0;
        const max = maxClicks ? parseInt(maxClicks) : Infinity;
        return urlClicks >= min && urlClicks <= max;
      }
      
      // Predefined click filter
      if (clickFilter && clickFilter !== "all") {
        switch (clickFilter) {
          case "0-10":
            return urlClicks >= 0 && urlClicks <= 10;
          case "11-100":
            return urlClicks >= 11 && urlClicks <= 100;
          case "101+":
            return urlClicks >= 101;
          default:
            return true;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      // Dynamic sorting
      if (sortBy === "clicks") {
        const aClicks = clicks?.filter((c) => c.url_id === a.id).length || 0;
        const bClicks = clicks?.filter((c) => c.url_id === b.id).length || 0;
        return sortOrder === "desc" ? bClicks - aClicks : aClicks - bClicks;
      } else if (sortBy === "title") {
        const aTitle = a.title || "";
        const bTitle = b.title || "";
        return sortOrder === "desc" 
          ? bTitle.localeCompare(aTitle)
          : aTitle.localeCompare(bTitle);
      } else {
        // Default: sort by created_at
        const aDate = new Date(a.created_at || 0);
        const bDate = new Date(b.created_at || 0);
        return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
      }
    }) || [];

  // Pagination logic
  const totalPages = Math.ceil((filteredUrls?.length || 0) / ITEMS_PER_PAGE);
  const paginatedUrls = filteredUrls?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Top clicked links for chart with null safety
  const topClickedLinks = clicks?.reduce((acc, click) => {
    const url = filteredUrls?.find(url => url.id === click.url_id);
    if (url && url.title) {
      if (!acc[url.title]) {
        acc[url.title] = 0;
      }
      acc[url.title]++;
    }
    return acc;
  }, {}) || {};

  const topClickedLinksData = Object.entries(topClickedLinks)
    .map(([link, clicks]) => ({
      link: link || "Untitled",
      clicks: clicks || 0
    }))
    .filter(item => item.clicks > 0) // Only include links with clicks
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFilter, clickFilter, startDate, endDate, minClicks, maxClicks, sortBy, sortOrder]);

  // Colors for pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  // Function to render different chart types with better error handling
  const renderChart = () => {
    if (!topClickedLinksData || topClickedLinksData.length === 0) {
      return (
        <div className="w-full h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available for the selected filters</p>
        </div>
      );
    }

    const chartProps = {
      data: topClickedLinksData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            <XAxis dataKey="link" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'none' }} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <XAxis dataKey="link" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'none' }} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="clicks" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))" 
              fillOpacity={0.6}
              isAnimationActive={false}
            />
          </AreaChart>
        );
      
      case 'horizontal':
        return (
          <BarChart layout="horizontal" {...chartProps}>
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="link" tick={{ fontSize: 12 }} width={100} />
            <Tooltip cursor={{ fill: 'none' }} />
            <Legend />
            <Bar 
              dataKey="clicks" 
              fill="hsl(var(--secondary))" 
              isAnimationActive={false}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={topClickedLinksData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ link, percent }) => `${link}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="clicks"
            >
              {topClickedLinksData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      
      default: // bar chart
        return (
          <BarChart {...chartProps}>
            <XAxis dataKey="link" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip cursor={{ fill: 'none' }} />
            <Legend />
            <Bar 
              dataKey="clicks" 
              fill="hsl(var(--primary))" 
              isAnimationActive={false}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto p-4 rounded-xl">
      <ScrollProgress />
      {(loading || loadingClicks) && <BarLoader className="mb-4" width={"100%"} color="#8884d8" />}
      <br />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-background rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl">Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl">{urls?.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-background rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl">{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graph Card */}
      <div className="w-full mt-4 pointer-events-none">
        <Card className="bg-background rounded-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-lg md:text-2xl">Top Clicked Links</CardTitle>
              <div className="pointer-events-auto">
                <Select
                  value={chartType}
                  onValueChange={setChartType}
                >
                  <SelectTrigger className="rounded-lg w-[140px]">
                    <SelectValue placeholder="Chart Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="horizontal">Horizontal Bar</SelectItem>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {urls?.length === 0 ? (
              <div className="w-full h-[150px] flex items-center justify-center">
                <p className="text-lg text-muted-foreground">Create a link first to see analytics</p>
              </div>
            ) : !clicks?.length ? (
              <div className="w-full h-[150px] flex items-center justify-center">
                <p className="text-lg text-muted-foreground">No data yet</p>
              </div>
            ) : (
              <>
                <div className="w-full h-[300px] md:h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                  </ResponsiveContainer>
                </div>
                {/* Chart Statistics - only show if there's data */}
                {topClickedLinksData && topClickedLinksData.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Most Clicked</p>
                        <p className="font-semibold">{topClickedLinksData[0]?.link || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{topClickedLinksData[0]?.clicks || 0} clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Total Links</p>
                        <p className="font-semibold">{topClickedLinksData.length}</p>
                        <p className="text-xs text-muted-foreground">with clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Total Clicks</p>
                        <p className="font-semibold">{topClickedLinksData.reduce((sum, item) => sum + (item.clicks || 0), 0)}</p>
                        <p className="text-xs text-muted-foreground">across all links</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Avg Clicks</p>
                        <p className="font-semibold">{topClickedLinksData.length ? Math.round(topClickedLinksData.reduce((sum, item) => sum + (item.clicks || 0), 0) / topClickedLinksData.length) : 0}</p>
                        <p className="text-xs text-muted-foreground">per link</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Links section */}
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl md:text-4xl font-extrabold">My Links</h1>
        <CreateLink className="rounded-xl" />
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Basic filters row */}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Search bar */}
          <Input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl h-full flex-1 p-2"
          />
          {/* Click filter */}
          <Select
            value={clickFilter}
            onValueChange={setClickFilter}
          >
            <SelectTrigger className="rounded-xl h-full w-full md:w-[200px] p-2 border">
              <SelectValue placeholder="All Clicks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clicks</SelectItem>
              <SelectItem value="0-10">0-10 Clicks</SelectItem>
              <SelectItem value="11-100">11-100 Clicks</SelectItem>
              <SelectItem value="101+">101+ Clicks</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Advanced Filters Button */}
          <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-xl flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </div>

                {/* Click Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MousePointer className="h-4 w-4" />
                      Min Clicks
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minClicks}
                      onChange={(e) => setMinClicks(e.target.value)}
                      className="rounded-lg"
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MousePointer className="h-4 w-4" />
                      Max Clicks
                    </label>
                    <Input
                      type="number"
                      placeholder="∞"
                      value={maxClicks}
                      onChange={(e) => setMaxClicks(e.target.value)}
                      className="rounded-lg"
                      min="0"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">Date Created</SelectItem>
                        <SelectItem value="clicks">Click Count</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort Order</label>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Descending</SelectItem>
                        <SelectItem value="asc">Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      setMinClicks("");
                      setMaxClicks("");
                      setSortBy("created_at");
                      setSortOrder("desc");
                      setDateFilter("");
                      setClickFilter("all");
                      setSearchQuery("");
                    }}
                    className="rounded-lg"
                  >
                    Clear All Filters
                  </Button>
                  <Button
                    onClick={() => setShowAdvancedFilters(false)}
                    className="rounded-lg"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Active filters display */}
        {(startDate || endDate || minClicks || maxClicks || searchQuery || clickFilter !== "all") && (
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                Search: &quot;{searchQuery}&quot;
              </span>
            )}
            {startDate && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                From: {startDate}
              </span>
            )}
            {endDate && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                To: {endDate}
              </span>
            )}
            {minClicks && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                Min clicks: {minClicks}
              </span>
            )}
            {maxClicks && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                Max clicks: {maxClicks}
              </span>
            )}
            {clickFilter !== "all" && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                Clicks: {clickFilter}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {(paginatedUrls || []).length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-background rounded-xl">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🔍</div>
                  <h3 className="text-xl font-semibold">No links found</h3>
                  <p className="text-muted-foreground max-w-md">
                    {(startDate || endDate || minClicks || maxClicks || searchQuery || clickFilter !== "all") 
                      ? "No links match your current filters. Try adjusting your search criteria."
                      : "You haven't created any links yet. Create your first link to get started!"
                    }
                  </p>
                  {(startDate || endDate || minClicks || maxClicks || searchQuery || clickFilter !== "all") && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                        setMinClicks("");
                        setMaxClicks("");
                        setSortBy("created_at");
                        setSortOrder("desc");
                        setDateFilter("");
                        setClickFilter("all");
                        setSearchQuery("");
                      }}
                      className="rounded-lg"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          (paginatedUrls || []).map((url, i) => {
            return <LinkCard key={i} url={url} fetchUrls={fnUrls} clicks={clicks || []} />
          })
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            variant="outline"
            className="rounded-xl"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            variant="outline"
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
      )}

      <ToastContainer {...toastConfig} />
    </div>
  );
};

export default Dashboard;