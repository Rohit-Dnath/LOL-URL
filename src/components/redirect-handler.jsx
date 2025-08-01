import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import { Helmet } from "react-helmet-async";

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

  // Generate social media meta tags for the URL
  const getSocialMetaTags = () => {
    if (!data) return {};
    
    const shortUrl = `${window.location.origin}/${data.custom_url || data.short_url}`;
    return {
      title: data.title || 'Shortened URL',
      description: `Visit ${data.title || 'this link'} via LOL URL`,
      url: shortUrl,
      image: `${window.location.origin}/api/social-preview/${data.id}`,
      type: 'website'
    };
  };

  const metaTags = getSocialMetaTags();

  if (loading) {
    return (
      <>
        <Helmet>
          <title>LOL URL - Redirecting...</title>
          <meta name="description" content="Redirecting to your destination..." />
        </Helmet>
        <div className="flex flex-col justify-center items-center h-screen">
          <strong>Redirecting...</strong>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Helmet>
          <title>LOL URL - Link Not Found</title>
          <meta name="description" content="The requested short URL was not found." />
        </Helmet>
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
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={metaTags.type} />
        <meta property="og:url" content={metaTags.url} />
        <meta property="og:title" content={metaTags.title} />
        <meta property="og:description" content={metaTags.description} />
        <meta property="og:image" content={metaTags.image} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={metaTags.url} />
        <meta property="twitter:title" content={metaTags.title} />
        <meta property="twitter:description" content={metaTags.description} />
        <meta property="twitter:image" content={metaTags.image} />
      </Helmet>
      <div className="flex flex-col justify-center items-center h-screen">
        <strong>Redirecting...</strong>
      </div>
    </>
  );
};

export default RedirectHandler;
