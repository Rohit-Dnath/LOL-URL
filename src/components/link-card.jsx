import { Copy, Delete, Download, LinkIcon, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LinkCard = ({ url, fetchUrls }) => {
  const DOMAIN = import.meta.env.VITE_YOUR_DOMAIN;
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

    toast.success("Image downloaded successfully!", {
      position: "top-right",
    });
  };
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${DOMAIN}/${url?.short_url}`);
    toast.success("URL copied to clipboard!", {
      position: "top-right",
    });
  };

  const handleDelete = () => {
    fnDelete().then(() => {
      fetchUrls();
      toast.success("URL deleted successfully!", {
        position: "top-right",
      });
    });
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-2 border p-4 bg-background rounded-xl shadow-lg w-full h-96 hover:shadow-2xl transition-transform duration-300 transform hover:scale-105">
        <div className="flex justify-between w-full">
          <img
            src={url?.qr}
            className="h-32 w-32 object-contain  self-start rounded"
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
              onClick={handleDelete}
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
          <span className="text-md text-blue-400 font-bold  cursor-pointer mt-1">
            {DOMAIN}/{url?.custom_url ? url?.custom_url : url.short_url}
          </span>
          <span className="flex items-center gap-1  cursor-pointer text-gray-400 mt-1">
            <LinkIcon className="p-1" />
            {url?.original_url}
          </span>

          <span className="flex items-end font-extralight text-sm flex-1 text-gray-500 mt-1">
            {new Date(url?.created_at).toLocaleString()}
          </span>
        </Link>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover style={{ zIndex: 9999 }} />
    </div>
  );
};

export default LinkCard;
