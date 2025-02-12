import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import React from "react";

const RedirectHandler = () => {
  const { id } = useParams();

  const { loading, data, fn } = useFetch(getLongUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      storeClicks({ id: data.id, originalUrl: data.original_url }).then(() => {
        window.location.href = data.original_url;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, data]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <strong>Redirecting...</strong>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="mt-8">
          <img 
            src="https://media.giphy.com/media/26ufnwz3wDUli7GU0/giphy.gif" 
            alt="Not Found" 
            className="w-full max-w-xs mb-4" 
          />
          <strong>LOL URL doesn't exist, ig :)</strong>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectHandler;
