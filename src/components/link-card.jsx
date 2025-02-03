import { Copy, Delete, Download, LinkIcon, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "@/utils/toastConfig";


const LinkCard = ({ url, fetchUrls }) => {
  const DOMAIN = window.location.origin;
  const downloadImage = async (e) => {
    e.preventDefault(); // Prevent default behavior

    const imageUrl = url?.qr;
    const fileName = `${url?.title}_qr`; // Add "qr" to the file name

    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(objectUrl);

    toast.success("Image downloaded successfully!", toastConfig);
  };
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  const handleCopy = () => {
    const link = `${window.location.origin}/${url?.custom_url ? url?.custom_url : url?.short_url}`;
    navigator.clipboard.writeText(link);
    toast.success("URL copied to clipboard!", toastConfig);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to delete this URL?");
    if (!confirmDelete) return;
    try {
      await fnDelete();
      fetchUrls();
      toast.success("URL deleted successfully!", toastConfig);
    } catch (error) {
      toast.error("Failed to delete URL.", toastConfig);
    }
  };

  return (
    <div className="relative">
      <Link to={`/link/${url?.id}`} className="flex flex-col gap-2 border p-4 bg-background rounded-xl shadow-lg w-full h-96 hover:shadow-2xl transition-transform duration-300 transform hover:scale-105">
        <div className="flex justify-between w-full">
          <img
            src={url?.qr}
            className="h-32 w-32 object-contain self-start "
            alt="qr code"
          />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="rounded"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCopy();
              }}
            >
              <Copy className="text-white" />
            </Button>
            <Button
              variant="ghost"
              className="rounded"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                downloadImage(e);
              }}
            >
              <Download className="text-white" />
            </Button>
            <Button
              variant="ghost"
              className="rounded"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(e);
              }}
              disable={loadingDelete}
            >
              {loadingDelete ? <BeatLoader size={5} color="white" /> : <Trash className="text-white" />}
            </Button>
          </div>
        </div>
        <div className="flex flex-col flex-1 mt-2 overflow-hidden">
          <h3 className="text-lg font-extrabold hover:underline cursor-pointer text-white mt-1 break-words">
            {url?.title}
          </h3>
          <span className="text-md text-blue-400 font-bold cursor-pointer mt-1 break-all">
            {window.location.origin}/{url?.custom_url ? url?.custom_url : url.short_url}
          </span>
          <div className="flex items-start gap-2 cursor-pointer text-gray-400 mt-1 break-all">
            <LinkIcon className="min-w-[16px] h-4 mt-1" />
            <span className="line-clamp-3 hover:line-clamp-none transition-all duration-300">
              {url?.original_url}
            </span>
          </div>
          <span className="flex items-end font-extralight text-sm text-gray-500 mt-auto pt-2">
            {new Date(url?.created_at).toLocaleString()}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default LinkCard;
