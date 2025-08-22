import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Card} from "./ui/card";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import Error from "./error";
import * as yup from "yup";
import useFetch from "@/hooks/use-fetch";
import {createUrl, checkCustomUrlExists} from "@/db/apiUrls";
import {BeatLoader} from "react-spinners";
import {UrlState} from "@/context";
import {QRCode} from "react-qrcode-logo";
import { CompactPicker } from 'react-color';
import { Image, Palette, ChevronDown, ChevronUp, LayoutGrid, Ruler, RotateCcw, Undo2, Redo2, Trash } from 'lucide-react';
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Slider } from "@/components/ui/slider";

export function CreateLink() {
  const DOMAIN = window.location.origin;
  const {user} = UrlState();

  const navigate = useNavigate();
  const ref = useRef();

  let [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [errors, setErrors] = useState({});

  const generateRandomString = (length) => {
    return Math.random().toString(36).substring(2, 2 + length);
  };

  const generateUniqueRandomString = async (length) => {
    let randomString;
    let exists = true;

    while (exists) {
      randomString = Math.random().toString(36).substring(2, 2 + length);
      exists = await checkCustomUrlExists(randomString);
    }

    return randomString;
  };

  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: generateRandomString(5),
  });

  const resetFormValues = async () => {
    const uniqueCustomUrl = await generateUniqueRandomString(5);
    setFormValues({
      title: "",
      longUrl: longLink ? longLink : "",
      customUrl: uniqueCustomUrl,
    });
  };

  useEffect(() => {
    resetFormValues();
  }, []);

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string().required("URL is required"),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, {...formValues, user_id: user.id});

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}?new=true`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, {abortEarly: false});

      const customUrlExists = await checkCustomUrlExists(formValues.customUrl);
      if (customUrlExists) {
        setErrors({customUrl: "URL already exists"});
        return;
      }

      const link = `${window.location.origin}/${formValues.customUrl}`;

      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      const result = await fnCreateUrl(blob, link);
      if (result) {
        navigate(`/link/${result[0].id}?new=true`);
      }
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  const [urlAvailable, setUrlAvailable] = useState(null);

  const checkUrlAvailability = async (url) => {
    if (!url) return;
    try {
      const exists = await checkCustomUrlExists(url);
      setUrlAvailable(!exists);
    } catch (error) {
      console.error("Error checking URL availability:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      checkUrlAvailability(formValues.customUrl);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [formValues.customUrl]);

  const [qrOptions, setQrOptions] = useState({
    backgroundColor: '#ffffff',
    foregroundColor: '#000000',
    logo: null,
    logoSize: 30,
    opacity: 100,
    boxShape: 0,
    borderWidth: 2,
    borderColor: '#000000',
    pattern: 'squares'  // Add this line
  });

  // Add history management
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Add handler for qrOptions changes to track history
  const handleQrOptionsChange = (newOptions) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(qrOptions);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setQrOptions(newOptions);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setQrOptions(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setQrOptions(history[historyIndex + 1]);
    }
  };

  const handleReset = () => {
    const defaultOptions = {
      backgroundColor: '#ffffff',
      foregroundColor: '#000000',
      logo: null,
      logoSize: 30,
      opacity: 100,
      boxShape: 0,
      borderWidth: 2,
      borderColor: '#000000',
      pattern: 'squares'
    };
    handleQrOptionsChange(defaultOptions);
  };

  const handleColorChange = (color, type) => {
    const newOptions = { ...qrOptions, [type]: color.hex };
    handleQrOptionsChange(newOptions);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newOptions = { ...qrOptions, logo: reader.result };
        handleQrOptionsChange(newOptions);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShapeChange = (value) => {
    const newOptions = { ...qrOptions, boxShape: value[0] };
    handleQrOptionsChange(newOptions);
  };

  const handleBorderWeightChange = (value) => {
    const newOptions = { ...qrOptions, borderWidth: value[0] };
    handleQrOptionsChange(newOptions);
  };

  const handleBorderColorChange = (e) => {
    const newOptions = { ...qrOptions, borderColor: e.target.value };
    handleQrOptionsChange(newOptions);
  };

  // Update padding calculation based on shape with smaller values
  const getContainerStyle = (boxShape) => ({
    borderRadius: `${boxShape * 0.5}%`, // Reduced multiplier for more subtle rounding
    overflow: 'hidden',
    padding: '2px',
    backgroundColor: qrOptions.backgroundColor,
    display: 'inline-block',
    width: 'max-content',
    border: `${qrOptions.borderWidth}px solid ${qrOptions.borderColor}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Add subtle shadow
    transition: 'all 0.3s ease' // Add smooth transitions
  });

  const [showCustomization, setShowCustomization] = useState(() => window.innerWidth >= 768);

  // Add effect to handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowCustomization(true);
      } else {
        setShowCustomization(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update pattern options to only include squares and rounded dots
  const patternOptions = [
    { id: 'squares', label: 'Square', value: 'squares' },
    { id: 'dots', label: 'Rounded Dots', value: 'dots' }
  ];

  // Add pattern handler
  const handlePatternChange = (pattern) => {
    const newOptions = { ...qrOptions, pattern: pattern };
    handleQrOptionsChange(newOptions);
  };

  // Modify QR code rendering props
  const getQRStyle = (pattern) => {
    if (pattern === 'dots') {
      return {
        width: '100%',
        height: '100%',
        shapeRendering: 'geometricPrecision'
      };
    }
    return {
      width: '100%',
      height: '100%'
    };
  };

  // Update QR size based on screen size
  const getQRSize = () => {
    if (window.innerWidth < 375) return 140;
    if (window.innerWidth < 640) return 160;
    return 200;
  };

  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={async (res) => {
        if (!res) {
          setSearchParams({});
          await resetFormValues();
        }
      }}
      className="rounded-xl"
    >
      <DialogTrigger asChild>
        <Button variant="" className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl bg-background border-2 border-border p-2 sm:p-4 md:p-6 max-h-[95vh] overflow-y-auto shadow-2xl rounded-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="font-bold text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Create New Link</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Left Column - QR Code Preview and Form Fields */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* QR Code Preview with responsive container */}
            <div className="relative flex justify-center items-center p-6 sm:p-8 bg-gradient-to-br from-muted/20 via-muted/10 to-transparent rounded-2xl border border-border/50 shadow-inner overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-full blur-xl"></div>
              
              { formValues.customUrl?.trim() ? (
                <div style={getContainerStyle(qrOptions.boxShape)} className="relative z-10 shadow-xl">
                  <QRCode 
                    ref={ref} 
                    size={getQRSize()} // Dynamic size based on screen width
                    value={`${window.location.origin}/${formValues.customUrl}`}
                    bgColor={qrOptions.backgroundColor}
                    fgColor={qrOptions.foregroundColor}
                    logoImage={qrOptions.logo}
                    logoWidth={qrOptions.logoSize}
                    logoHeight={qrOptions.logoSize}
                    removeQrCodeBehindLogo={true}
                    logoPadding={0.1} // Reduced from 0.2 to 0.1
                    logoOpacity={1}
                    quiet={0.1} // Reduced from 0.2 to 0.1
                    style={getQRStyle(qrOptions.pattern)}
                    {...(qrOptions.pattern === 'dots' ? {
                      dotScale: 1, // Increased from 0.8 to 1
                      qrStyle: 'dots',
                      eyeRadius: 8 // Add rounded corners to the eyes
                    } : {})}
                  />
                </div>
              ) : (
                <div
                  style={{
                    width: getQRSize(), // Dynamic size for placeholder too
                    height: getQRSize(),
                    border: '2px dashed currentColor',
                    clipPath: 'polygon(0 10%, 10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'hsl(var(--muted-foreground))',
                    backgroundColor: 'hsl(var(--muted))',
                  }}
                  className="relative z-10 transition-all duration-300 hover:scale-105 hover:border-primary/50"
                >
                  <span className="font-medium">LOL No QR</span>
                </div>
              )}
            </div>

            {/* Form Fields with better spacing for mobile */}
            <div className="flex flex-col gap-3 sm:gap-4 p-5 sm:p-6 bg-gradient-to-br from-muted/20 via-muted/10 to-transparent rounded-2xl border border-border/30 shadow-sm">
              <div className="space-y-1">
                <label htmlFor="title" className="text-sm font-medium text-muted-foreground">Link Title</label>
                <Input
                  id="title"
                  placeholder="Short Link's Title"
                  value={formValues.title}
                  onChange={handleChange}
                  className="rounded-xl border-border/50 focus:border-primary transition-all duration-300 hover:border-border focus:ring-2 focus:ring-primary/20"
                />
                {errors.title && <Error message={errors.title} />}
              </div>
              
              <div className="space-y-1">
                <label htmlFor="longUrl" className="text-sm font-medium text-muted-foreground">Original URL</label>
                <Input
                  id="longUrl"
                  placeholder="Enter your Loooong URL"
                  value={formValues.longUrl}
                  onChange={handleChange}
                  className="rounded-xl border-border/50 focus:border-primary transition-all duration-300 hover:border-border focus:ring-2 focus:ring-primary/20"
                />
                {errors.longUrl && <Error message={errors.longUrl} />}
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Custom URL</label>
                <div className="flex items-center">
                  <Card className="p-3 rounded-xl bg-muted/50 text-muted-foreground font-mono text-sm border-border/50 shrink-0 rounded-r-none h-12">{window.location.origin}/</Card>
                  <Input
                    id="customUrl"
                    placeholder="xyz.."
                    value={formValues.customUrl}
                    onChange={handleChange}
                    className={`rounded-xl h-12 rounded-l-none transition-all duration-300 flex-1 ${
                      urlAvailable === null
                        ? "border-border/50 hover:border-border focus:ring-2 focus:ring-primary/20"
                        : urlAvailable
                        ? "border-green-500 focus-visible:ring-green-500 bg-green-50/10 dark:bg-green-950/20 focus:ring-2 focus:ring-green-500/20"
                        : "border-red-500 focus-visible:ring-red-500 bg-red-50/20 dark:bg-red-950/20 focus:ring-2 focus:ring-red-500/20"
                    }`}
                  />
                </div>
                {formValues.customUrl && (
                  <div className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${urlAvailable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    <div className={`w-2 h-2 rounded-full ${urlAvailable ? "bg-green-500" : "bg-red-500"}`}></div>
                    {urlAvailable ? "URL is available" : "URL is not available"}
                  </div>
                )}
                {errors.customUrl && <Error message={errors.customUrl} />}
                {error && <Error message={error.message} />}
              </div>
              
              {/* Create button for mobile */}
              <Button
                type="button"
                variant=""
                onClick={createNewLink}
                disabled={loading}
                className="w-full rounded-xl py-3 px-4 mt-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50"
              >
                {loading ? <BeatLoader size={8} color="currentColor" /> : "Create Link"}
              </Button>
            </div>
          </div>

          {/* Right Column - QR Customization */}
          <div className="relative flex flex-col gap-3 lg:border-l lg:border-border/30 lg:pl-6">
            <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-3 px-2 rounded-xl border border-border/20">
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Customize QR</h3>
              {/* Only show controls when customization is visible */}
              {showCustomization && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="w-8 h-8 p-0 rounded-lg hover:bg-muted/50 transition-all duration-200"
                  >
                    <Undo2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="w-8 h-8 p-0 rounded-lg hover:bg-muted/50 transition-all duration-200"
                  >
                    <Redo2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="w-8 h-8 p-0 rounded-lg hover:bg-muted/50 transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {/* Only show toggle on small screens */}
              <button 
                onClick={() => setShowCustomization(prev => !prev)} 
                className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-all duration-200"
              >
                {showCustomization ? (
                  <ChevronUp className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                )}
              </button>
            </div>
            
            {showCustomization && (
              <div className="space-y-4 sm:space-y-5 overflow-y-auto max-h-[40vh] sm:max-h-[50vh] lg:max-h-none pb-4 px-1">
                {/* Color Pickers Grid with adjusted sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Background Color */}
                  <div className="space-y-2 sm:space-y-3 p-4 bg-muted/20 rounded-2xl border border-border/30">
                    <label className="flex items-center gap-2 font-medium">
                      <Palette className="w-4 h-4 text-primary" />
                      <span className="text-sm">Background</span>
                    </label>
                    <div className="flex flex-col">
                      <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm">
                        <HexColorPicker 
                          color={qrOptions.backgroundColor}
                          onChange={(color) => handleColorChange({ hex: color }, 'backgroundColor')}
                          style={{ width: '100%', height: '120px' }}
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-2 h-8">
                        <div 
                          className="w-6 h-6 rounded-lg border-2 border-border shadow-sm"
                          style={{ backgroundColor: qrOptions.backgroundColor }}
                        />
                        <input
                          type="text"
                          value={qrOptions.backgroundColor}
                          onChange={(e) => handleColorChange({ hex: e.target.value }, 'backgroundColor')}
                          className="flex-1 p-2 text-xs sm:text-sm rounded-lg border border-border/50 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* QR Code Color */}
                  <div className="space-y-2 sm:space-y-3 p-4 bg-muted/20 rounded-2xl border border-border/30">
                    <label className="flex items-center gap-2 font-medium">
                      <Palette className="w-4 h-4 text-primary" />
                      <span className="text-sm">QR Color</span>
                    </label>
                    <div className="flex flex-col">
                      <div className="rounded-xl overflow-hidden border border-border/50 shadow-sm">
                        <HexColorPicker 
                          color={qrOptions.foregroundColor}
                          onChange={(color) => handleColorChange({ hex: color }, 'foregroundColor')}
                          style={{ width: '100%', height: '120px' }}
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-2 h-8">
                        <div 
                          className="w-6 h-6 rounded-lg border-2 border-border shadow-sm"
                          style={{ backgroundColor: qrOptions.foregroundColor }}
                        />
                        <input
                          type="text"
                          value={qrOptions.foregroundColor}
                          onChange={(e) => handleColorChange({ hex: e.target.value }, 'foregroundColor')}
                          className="flex-1 p-2 text-xs sm:text-sm rounded-lg border border-border/50 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo Upload and Size Control Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Logo Upload */}
                  <div className="space-y-3 p-4 bg-muted/20 rounded-2xl border border-border/30">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Image className="w-4 h-4 text-primary" />
                      Upload Logo
                    </label>
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className="flex flex-col gap-2 items-center relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 border-2 border-dashed border-border/50 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all duration-300 group"
                          onClick={(e) => {
                            if (e.target.closest('button')) {
                              e.preventDefault();
                            }
                          }}
                        >
                          {qrOptions.logo ? (
                            <>
                              <img
                                src={qrOptions.logo}
                                alt="Logo preview"
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-sm"
                              />
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Image className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                              <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-200">Click to upload</span>
                            </div>
                          )}
                        </label>
                        {qrOptions.logo && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQrOptionsChange({ ...qrOptions, logo: null });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5 shadow-lg transition-all duration-200 transform hover:scale-110"
                          >
                            <Trash className="w-3 h-3 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Logo Size Slider */}
                  {qrOptions.logo && (
                    <div className="space-y-3 p-4 bg-muted/20 rounded-2xl border border-border/30">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Ruler className="w-4 h-4 text-primary" />
                          Logo Size
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">{qrOptions.logoSize}px</span>
                      </div>
                      <Slider
                        defaultValue={[30]}
                        min={30}
                        max={50}
                        step={1}
                        value={[qrOptions.logoSize]}
                        onValueChange={(value) => handleQrOptionsChange({ ...qrOptions, logoSize: value[0] })}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                {/* Pattern Section */}
                <div className="w-full space-y-3 p-4 bg-muted/20 rounded-2xl border border-border/30">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <LayoutGrid className="w-4 h-4 text-primary" />
                    <span>QR Pattern</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {patternOptions.map((pattern) => (
                      <Button
                        key={pattern.id}
                        variant={qrOptions.pattern === pattern.value ? "default" : "outline"}
                        className={`py-3 px-4 text-sm rounded-xl border-border/50 transition-all duration-300 ${
                          qrOptions.pattern === pattern.value 
                            ? "shadow-lg transform scale-105" 
                            : "hover:border-primary/50 hover:bg-muted/30"
                        }`}
                        onClick={() => handlePatternChange(pattern.value)}
                      >
                        {pattern.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Add this CSS to your styles
const styles = `
.react-colorful {
  width: 100% !important;
  height: 120px !important;
  border-radius: 12px !important;
}

.react-colorful__hue {
  height: 16px !important;
  border-radius: 8px !important;
}

.react-colorful__saturation {
  height: 90px !important;
  border-radius: 8px 8px 0 0 !important;
}

.react-colorful__saturation-pointer,
.react-colorful__hue-pointer {
  width: 16px !important;
  height: 16px !important;
  border-width: 2px !important;
  border-color: hsl(var(--background)) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

.react-colorful__saturation-pointer {
  border-radius: 50% !important;
}

.react-colorful__hue-pointer {
  border-radius: 50% !important;
}

.react-colorful {
  width: 100% !important;
  height: 120px !important;
  max-width: 100% !important;
  margin: 0 !important;
  border: none !important;
  box-shadow: none !important;
  border-radius: 12px !important;
  overflow: hidden !important;
}

@media (max-width: 640px) {
  .react-colorful {
    height: 100px !important;
  }

  .react-colorful__saturation {
    height: 70px !important;
  }

  .react-colorful__hue {
    height: 14px !important;
  }
  
  .react-colorful__saturation-pointer,
  .react-colorful__hue-pointer {
    width: 14px !important;
    height: 14px !important;
  }
}

/* Custom scrollbar for the customization panel */
.space-y-4::-webkit-scrollbar {
  width: 6px;
}

.space-y-4::-webkit-scrollbar-track {
  background: hsl(var(--muted));
  border-radius: 6px;
}

.space-y-4::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground));
  border-radius: 6px;
}

.space-y-4::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary));
}
`;

// Add style tag
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
