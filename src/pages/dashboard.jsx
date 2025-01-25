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
import { ToastContainer } from "react-toastify";
import { toastConfig } from "@/utils/toastConfig";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {user} = UrlState();
  const {loading, error, data: urls, fn: fnUrls} = useFetch(getUrls, user.id);
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

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes((searchQuery || "").toLowerCase())
  );

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

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto p-4">
      <ScrollProgress />
      {loading || loadingClicks && <BarLoader className="mb-4" width={"100%"} color="#8884d8" />}
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
                    <Tooltip cursor={{fill: 'none'}} />
                    <Legend />
                    <Bar dataKey="clicks" fill="#8884d8" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modified My Links section */}
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl md:text-4xl font-extrabold">My Links</h1>
        <CreateLink className="rounded" />
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 rounded h-full flex-1 p-2 mb-4"
        />
        <Filter className="absolute top-2 right-2 p-1 mt-2" />
      </div>

      {error && <Error message={error?.message} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {(filteredUrls || []).map((url, i) => {
          return <LinkCard key={i} url={url} fetchUrls={fnUrls} />
        })}
      </div>

      <ToastContainer {...toastConfig} />
    </div>
  );
};

export default Dashboard;
