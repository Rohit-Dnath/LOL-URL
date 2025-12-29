import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import Header from "@/components/header";

const RedirectHandler = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      <div className="fixed inset-0 bg-white" />
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-6xl px-2">
          <Header />
        </div>
        <div className="flex flex-col justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <img 
              src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3dzNTdhajNqa3oydml4Y3dobm5wbGdnZWVzdWw0ZHZxbmw0YmhzYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/s0ga0kEwOZcSBRsTmI/giphy.gif" 
              alt="Not Found" 
              className="w-full max-w-xs mb-4 mx-auto" 
            />
            <strong className="text-lg">Kilq Kliq....Not found :(</strong>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectHandler;
