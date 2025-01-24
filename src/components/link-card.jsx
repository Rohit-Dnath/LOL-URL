import { Copy, Delete, Download, LinkIcon, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LinkCard = ({ url, fetchUrls }) => {
  const DOMAIN = import.meta.env.VITE_YOUR_DOMAIN;
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();

    document.body.removeChild(anchor);
  };
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${DOMAIN}/${url?.short_url}`);
    toast.success("URL copied to clipboard!", {
      position: "top-right",
    });
  };

  return (
    <div className="flex flex-col gap-2 border p-4 bg-gray-800 rounded-xl shadow-lg w-full h-96 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex justify-between w-full">
        <img
          src={url?.qr}
          className="h-32 w-32 object-contain ring ring-blue-500 self-start rounded-lg"
          alt="qr code"
        />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="rounded"
            onClick={handleCopy}
          >
            <Copy className="text-white" />
          </Button>
          <Button variant="ghost" className="rounded" onClick={downloadImage}>
            <Download className="text-white" />
          </Button>
          <Button
            variant="ghost"
            className="rounded"
            onClick={() => fnDelete().then(() => fetchUrls())}
            disable={loadingDelete}
          >
            {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash className="text-white" />}
          </Button>
        </div>
      </div>
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 mt-2">
        <span className="text-lg font-extrabold hover:underline cursor-pointer text-white mt-1">
          {url?.title}
        </span>
        <span className="text-md text-blue-400 font-bold hover:underline cursor-pointer mt-1">
          {DOMAIN}/{url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer text-gray-400 mt-1">
          <LinkIcon className="p-1" />
          {url?.original_url}
        </span>

        <span className="flex items-end font-extralight text-sm flex-1 text-gray-500 mt-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
    </div>
  );
};
export default LinkCard;
