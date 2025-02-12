import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const RedirectLink = () => {
  const { id } = useParams();

  const { loading, data, fn } = useFetch(getLongUrl, id);

  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats().then(() => {
        setTimeout(() => {
          window.location.href = data.original_url;
        }, 100); // Reduced delay to 0.1 seconds
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader width={"100%"} color="#8884d8" />
        <br />
        <strong className="">Redirecting...</strong>
        <DotLottieReact
          src="https://lottie.host/bd7e9ba4-29f2-4660-8549-c28f74fcdb94/beN4xnKRlb.lottie"
          loop
          autoplay
          style={{
            width: '100%',
            maxWidth: '400px',
            margin: '0 auto',
            display: 'block'
          }}
        />
      </>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col justify-center items-center h-screen overflow-hidden">
        <div className="mt-8">
          <img 
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnV3ZHVtZXhzb3N2ODNybDhicThzNHh1MW9xYWQ5eG5vejgyazY3dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C21GGDOpKT6Z4VuXyn/giphy.gif" 
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

export default RedirectLink;