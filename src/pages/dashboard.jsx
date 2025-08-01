import { CreateLink } from "@/components/create-link";
import LinkCard from "@/components/link-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { UrlState } from "@/context";
import { getClicksForUrls } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from "react-toastify";
import { toastConfig } from "@/utils/toastConfig";
import { useLocation } from "react-router-dom";

const ITEMS_PER_PAGE = 6; // Number of links per page

const Dashboard = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // For date filtering
  const [clickFilter, setClickFilter] = useState(""); // For click filtering
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = UrlState();
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user.id);
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

  // Filtering logic
  const filteredUrls = urls
    ?.filter((url) =>
      url.title.toLowerCase().includes((searchQuery || "").toLowerCase())
    )
    .filter((url) => {
      if (!dateFilter) return true;
      // Compare only the date part
      return url.created_at && new Date(url.created_at).toISOString().slice(0, 10) === dateFilter;
    })
    .filter((url) => {
      if (!clickFilter) return true;
      const urlClicks = clicks?.filter((c) => c.url_id === url.id).length || 0;
      if (clickFilter === "0-10") return urlClicks >= 0 && urlClicks <= 10;
      if (clickFilter === "11-100") return urlClicks >= 11 && urlClicks <= 100;
      if (clickFilter === "101+") return urlClicks >= 101;
      return true;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Pagination logic
  const totalPages = Math.ceil((filteredUrls?.length || 0) / ITEMS_PER_PAGE);
  const paginatedUrls = filteredUrls?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Top clicked links for chart
  const topClickedLinks = clicks?.reduce((acc, click) => {
    const url = urls.find(url => url.id === click.url_id);
    if (url) {
      if (!acc[url.title]) {
        acc[url.title] = 0;
      }
      acc[url.title]++;
    }
    return acc;
  }, {});

  const topClickedLinksData = Object.entries(topClickedLinks || {})
    .map(([link, clicks]) => ({
      link,
      clicks
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFilter, clickFilter]);

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto p-4">
      <ScrollProgress />
      {(loading || loadingClicks) && <BarLoader className="mb-4" width={"100%"} color="#8884d8" />}
      <br />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-background rounded">
          <CardHeader>
            <CardTitle className="text-2xl md:text-2xl text-lg">Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl">{urls?.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-background rounded">
          <CardHeader>
            <CardTitle className="text-2xl md:text-2xl text-lg">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl">{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graph Card */}
      <div className="w-full mt-4 pointer-events-none">
        <Card className="bg-background rounded">
          <CardHeader>
            <CardTitle className="text-2xl md:text-2xl text-lg">Top Clicked Links</CardTitle>
          </CardHeader>
          <CardContent>
            {urls?.length === 0 ? (
              <div className="w-full h-[150px] flex items-center justify-center">
                <p className="text-lg text-gray-500">Create a link first to see analytics</p>
              </div>
            ) : !clicks?.length ? (
              <div className="w-full h-[150px] flex items-center justify-center">
                <p className="text-lg text-gray-500">No data yet</p>
              </div>
            ) : (
              <div className="w-full h-[300px] md:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topClickedLinksData}>
                    <XAxis dataKey="link" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'none' }} />
                    <Legend />
                    <Bar dataKey="clicks" fill="#8884d8" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Links section */}
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl md:text-4xl font-extrabold">My Links</h1>
        <CreateLink className="rounded" />
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        {/* Search bar */}
        <Input
          type="text"
          placeholder="Search links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded h-full flex-1 p-2"
        />
        {/* Date filter */}
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded h-full flex-1 p-2"
        />
        {/* Click filter */}
        <select
          value={clickFilter}
          onChange={(e) => setClickFilter(e.target.value)}
          className="rounded h-full flex-1 p-2 border"
        >
          <option value="">All Clicks</option>
          <option value="0-10">0-10 Clicks</option>
          <option value="11-100">11-100 Clicks</option>
          <option value="101+">101+ Clicks</option>
        </select>
      </div>

      {error && <Error message={error?.message} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {(paginatedUrls || []).map((url, i) => {
          return <LinkCard key={i} url={url} fetchUrls={fnUrls} />
        })}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            variant="outline"
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