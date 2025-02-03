import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "react-spinners";
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';







const RedirectLink = () => {
  const {id} = useParams();

  const {loading, data, fn} = useFetch(getLongUrl, id);

  const {loading: loadingStats, fn: fnStats} = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats().then(() => {
        window.location.href = data.original_url;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading || loadingStats) {
    return (
      // <>
      //   <BarLoader width={"100%"} color="#8884d8" />
      //   <br />
      //     <strong className="">Redirecting...</strong>
      //   <div className="flex flex-col justify-center items-center h-screen">
      //     <img src={paperPlaneGif} alt="Redirecting" className="w-3/4 h-3/4" />
      //   </div>
      // </>
      <>
      <BarLoader width={"100%"} color="#8884d8" />
      <br />
      <strong className="">Redirecting...</strong>
<DotLottieReact
src="https://lottie.host/bd7e9ba4-29f2-4660-8549-c28f74fcdb94/beN4xnKRlb.lottie"
loop
autoplay
/>
      </>


    );
  }

  return null;
};

export default RedirectLink;