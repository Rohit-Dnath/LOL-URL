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
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      {loading || loadingClicks && <BarLoader className=" mb-4" width={"100%"} color="#8884d8" />}
      <br />
      <div className="flex justify-between">
        <div className="flex flex-col gap-4" style={{  width: '48%' }}>
          <Card className="bg-background rounded" style={{ flex: 1 }}>
            <CardHeader>
              <CardTitle className="text-2xl">Links Created</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl">{urls?.length}</p>
            </CardContent>
          </Card>
          <ScrollProgress className="w-full" />
          <Card className="bg-background rounded" style={{ flex: 1 }}>
            <CardHeader>
              <CardTitle className="text-2xl">Total Clicks</CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-2xl">{clicks?.length}</p>
            </CardContent>
          </Card>
        </div>
        <div style={{ width: '50%', pointerEvents: 'none' }}>
          <Card className="bg-background rounded">
            <CardHeader>
              <CardTitle className="text-2xl">Top Clicked Links</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topClickedLinksData}>
                  <XAxis dataKey="link" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'none'}} />
                  <Legend />
                  <Bar dataKey="clicks" fill="#8884d8" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h1 className=" text-4xl font-extrabold ">My Links</h1>
        <CreateLink className="rounded" />
      </div>
      <div className="relative ">
        <Input
          type="text"
          placeholder="Filter Links...."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2 rounded h-full flex-1 p-2 mb-4  "
        />
        <Filter className="absolute top-2 right-2 p-1 mt-2" />
      </div>
      {error && <Error message={error?.message} />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(filteredUrls || []).map((url, i) => {
          return <LinkCard key={i} url={url} fetchUrls={fnUrls} />
        })}
      </div>
    </div>
  );
};

export default Dashboard;
