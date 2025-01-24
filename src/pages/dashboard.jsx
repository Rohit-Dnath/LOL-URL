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


  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  return (
    
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      {loading || loadingClicks && <BarLoader className=" mb-4" width={"100%"} color="#36d7b7" />}
      <br />
      <div className="grid grid-cols-2 gap-4 ">
        <Card className="bg-background rounded">
          <CardHeader>
            <CardTitle >Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <ScrollProgress className=" w-full" />
        <Card className="bg-background rounded">
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>
     

      <div className="flex justify-between items-center">
        <h1 className=" text-4xl font-extrabold ">My Links</h1>
        <CreateLink  className="rounded"/>
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
