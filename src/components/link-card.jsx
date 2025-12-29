import { Copy, Download, LinkIcon, Trash, Calendar, MousePointer, Eye, ExternalLink, TrendingUp } from "lucide-react";
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
  
  // Performance calculation
  const getPerformance = () => {
    if (totalClicks === 0) return { label: 'No Data', color: 'text-muted-foreground', bg: 'bg-muted', width: 0 };
    if (totalClicks > 10) return { label: 'High', color: 'text-primary', bg: 'bg-primary', width: 100 };
    if (totalClicks > 5) return { label: 'Medium', color: 'text-blue-500', bg: 'bg-blue-500', width: 60 };
    return { label: 'Low', color: 'text-yellow-500', bg: 'bg-yellow-500', width: 30 };
  };
  
  const performance = getPerformance();
  
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
    e.preventDefault();
    e.stopPropagation();

    const imageUrl = url?.qr;
    const fileName = `${url?.title}_qr`;

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

    toast.success("QR code downloaded!", toastConfig);
  };
  
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const link = `${window.location.origin}/${url?.custom_url ? url?.custom_url : url?.short_url}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied!", toastConfig);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmDelete = window.confirm("Delete this link permanently?");
    if (!confirmDelete) return;
    try {
      await fnDelete();
      fetchUrls();
      toast.success("Link deleted!", toastConfig);
    } catch {
      toast.error("Failed to delete.", toastConfig);
    }
  };

  return (
    <Link 
      to={`/link/${url?.id}`} 
      className="group block h-full"
    >
      <div className="h-full border-2 border-border bg-card rounded-xl overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-lg hover:shadow-primary/5">
        
        {/* Header with QR and Title */}
        <div className="p-6 border-b border-border bg-gradient-to-b from-muted/30 to-transparent">
          <div className="flex items-start gap-4">
            {/* QR Code */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-lg bg-white p-2 shadow-sm border border-border/50">
                <img
                  src={url?.qr}
                  className="w-full h-full object-contain"
                  alt="QR Code"
                />
              </div>
              <button
                onClick={downloadImage}
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-primary text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:bg-primary/90"
                title="Download QR"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Title and Meta */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-2 truncate group-hover:text-primary transition-colors">
                {url?.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(url?.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span className={performance.color}>{performance.label}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                onClick={handleCopy}
                title="Copy Link"
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(url?.original_url, '_blank');
                }}
                title="Visit URL"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={handleDelete}
                disabled={loadingDelete}
                title="Delete"
              >
                {loadingDelete ? (
                  <BeatLoader size={3} color="currentColor" />
                ) : (
                  <Trash className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* URLs Section */}
        <div className="p-6 space-y-4">
          {/* Short URL */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Short URL
            </label>
            <div className="relative group/url">
              <div className="bg-muted/50 border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground hover:border-primary/50 transition-colors cursor-pointer" onClick={handleCopy}>
                <span className="break-all">
                  {window.location.origin.replace(/^https?:\/\//, '')}/{url?.custom_url || url.short_url}
                </span>
              </div>
              <Copy className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-0 group-hover/url:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Original URL */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Original URL
            </label>
            <div className="flex items-start gap-2 px-4 py-3 bg-muted/30 rounded-lg border border-border">
              <LinkIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground/80 break-all line-clamp-2">
                {url?.original_url}
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Footer */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MousePointer className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Total Clicks</div>
                  <div className="text-2xl font-bold text-foreground">{totalClicks}</div>
                </div>
              </div>
              
              {totalClicks > 0 && (
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Performance</div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${performance.bg} transition-all duration-500`}
                        style={{ width: `${performance.width}%` }}
                      ></div>
                    </div>
                    <span className={`text-xs font-semibold ${performance.color}`}>
                      {performance.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {totalClicks === 0 && (
              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground">No clicks yet - Share your link!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
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
