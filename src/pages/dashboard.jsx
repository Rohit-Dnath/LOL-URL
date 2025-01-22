import LinkCard from "@/components/link-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UrlState } from "@/context";
import { getClicksForUrls } from "@/db/apiClicks";
import { getUrls } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { Filter } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

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
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      {loading || loadingClicks && <BarLoader className=" mb-4" width={"100%"} color="#36d7b7" />}
      <div className="grid grid-cols-2 gap-4 ">
        <Card className=" rounded">
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card className=" rounded">
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h1 className=" text-4xl font-extrabold">My Links</h1>
        <Button className=" rounded">Create Link</Button>
      </div>

      <div className="relative ">
        <Input
          type="text"
          placeholder="Filter Links...."
          value={searchQuery}
          onChange={setSearchQuery}
          className="mt-2 rounded h-full flex-1    "
        />
        <Filter className="absolute top-2 right-2 p-1 mt-2" />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url, i) => {
        return <LinkCard key={i} url={url} fetchUrls={fnUrls} />
        // return url.title; 
        
      })}
    </div>
  );
};

export default Dashboard;
