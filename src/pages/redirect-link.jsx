import {storeClicks} from "@/db/apiClicks";
import {getLongUrl} from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {BarLoader} from "react-spinners";
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';







const RedirectLink = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('c');

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
      fnStats();
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
src="https://lottie.host/12bef52c-eb23-435e-9da7-9dde45c176e9/Eab4AJWhDS.lottie"
loop
autoplay
/>
      </>


    );
  }

  return null;
};

export default RedirectLink;