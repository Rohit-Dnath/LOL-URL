import { Copy, Download, LinkIcon, Trash, Calendar, MousePointer, Eye, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastConfig } from "@/utils/toastConfig";
import PropTypes from "prop-types";


const LinkCard = ({ url, fetchUrls, clicks = [] }) => {
  // Calculate clicks for this URL
  const urlClicks = clicks.filter(click => click.url_id === url.id);
  const totalClicks = urlClicks.length;
  const uniqueClicks = new Set(urlClicks.map(click => click.ip)).size;
  
  // Format creation date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };
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
    } catch {
      toast.error("Failed to delete URL.", toastConfig);
    }
  };

  return (
    <div className="relative h-[480px]">
      <Link 
        to={`/link/${url?.id}`} 
        className="flex flex-col h-full border border-gray-600 bg-gray-900/50 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-500 overflow-hidden"
      >
        {/* Header Section with QR Code and Actions */}
        <div className="flex items-start justify-between p-4 border-b border-gray-700">
          <div className="flex items-start gap-3">
            <img
              src={url?.qr}
              className="h-16 w-16 object-contain rounded-md bg-white p-1"
              alt="QR Code"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white truncate mb-1">
                {url?.title}
              </h3>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(url?.created_at)}</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCopy();
              }}
              title="Copy Link"
            >
              <Copy className="w-3 h-3 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                downloadImage(e);
              }}
              title="Download QR Code"
            >
              <Download className="w-3 h-3 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(url?.original_url, '_blank');
              }}
              title="Visit Original URL"
            >
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-gray-700"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(e);
              }}
              disabled={loadingDelete}
              title="Delete Link"
            >
              {loadingDelete ? (
                <BeatLoader size={3} color="#9ca3af" />
              ) : (
                <Trash className="w-3 h-3 text-gray-400" />
              )}
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 space-y-3">
          {/* Short URL */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Short URL
            </div>
            <div className="bg-gray-800 rounded-md p-2 border border-gray-700">
              <span className="text-sm text-white font-mono break-all">
                {window.location.origin}/{url?.custom_url ? url?.custom_url : url.short_url}
              </span>
            </div>
          </div>

          {/* Original URL */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Original URL
            </div>
            <div className="flex items-start gap-2">
              <LinkIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-300 break-all line-clamp-2">
                {url?.original_url}
              </span>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Analytics
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800 rounded-md p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <MousePointer className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">Total Clicks</span>
                </div>
                <div className="text-lg font-semibold text-white">{totalClicks}</div>
              </div>
              
              <div className="bg-gray-800 rounded-md p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">Unique Views</span>
                </div>
                <div className="text-lg font-semibold text-white">{uniqueClicks}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Performance */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/30">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Performance: {totalClicks > 10 ? 'High' : totalClicks > 5 ? 'Medium' : totalClicks > 0 ? 'Low' : 'No Data'}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(url?.created_at).toLocaleDateString()}
            </span>
          </div>
          {totalClicks > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
              <div 
                className="h-1 rounded-full bg-gray-400"
                style={{ width: `${Math.min((totalClicks / 20) * 100, 100)}%` }}
              ></div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

LinkCard.propTypes = {
  url: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    qr: PropTypes.string.isRequired,
    custom_url: PropTypes.string,
    short_url: PropTypes.string.isRequired,
    original_url: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  fetchUrls: PropTypes.func.isRequired,
  clicks: PropTypes.arrayOf(
    PropTypes.shape({
      url_id: PropTypes.string.isRequired,
      ip: PropTypes.string.isRequired,
    })
  ),
};

export default LinkCard;
