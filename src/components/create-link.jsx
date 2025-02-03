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
    borderRadius: `${boxShape}%`,
    overflow: 'hidden',
    padding: boxShape === 50 ? '12px' : '4px', // Reduced padding from 24px/8px to 12px/4px
    backgroundColor: qrOptions.backgroundColor,
    display: 'inline-block',
    width: 'fit-content',
    border: `${qrOptions.borderWidth}px solid ${qrOptions.borderColor}` // Add border style
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

  // Add new state for QR pattern
  const [qrPattern, setQrPattern] = useState('squares'); // possible values: squares, dots, rounded, triangular

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
    if (window.innerWidth < 375) return 80; // Extra small devices
    if (window.innerWidth < 640) return 100; // Small devices
    return 140; // Larger devices
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
    >
      <DialogTrigger asChild>
        <Button variant="" className="rounded">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl rounded bg-background p-2 sm:p-4 md:p-6 max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="font-bold text-lg sm:text-xl md:text-2xl">Create New Link</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Left Column - QR Code Preview and Form Fields */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* QR Code Preview with responsive container */}
            <div className="flex justify-center items-center p-2 sm:p-4 bg-background rounded-lg">
              { formValues.customUrl?.trim() ? (
                <div style={getContainerStyle(qrOptions.boxShape)}>
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
                    border: '2px dashed #1e293b',
                    clipPath: 'polygon(0 10%, 10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1e293b',
                  }}
                >
                  LOL No QR
                </div>
              )}
            </div>

            {/* Form Fields with better spacing for mobile */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <Input
                id="title"
                placeholder="Short Link's Title"
                value={formValues.title}
                onChange={handleChange}
                className="rounded"
              />
              {errors.title && <Error message={errors.title} />}
              
              <Input
                id="longUrl"
                placeholder="Enter your Loooong URL"
                value={formValues.longUrl}
                onChange={handleChange}
                className="rounded"
              />
              {errors.longUrl && <Error message={errors.longUrl} />}
              
              <div className="flex items-center gap-2">
                <Card className="p-2 rounded">{window.location.origin}</Card> /
                <Input
                  id="customUrl"
                  placeholder="xyz.."
                  value={formValues.customUrl}
                  onChange={handleChange}
                  className={`rounded ${
                    urlAvailable === null
                      ? ""
                      : urlAvailable
                      ? "border-green-500 focus-visible:ring-green-500"
                      : "border-red-500 focus-visible:ring-red-500"
                  }`}
                />
              </div>
              {formValues.customUrl && (
                <p className={`text-sm ${urlAvailable ? "text-green-500" : "text-red-500"}`}>
                  {urlAvailable ? "✓ URL is available" : "✗ URL is not available"}
                </p>
              )}
              {errors.customUrl && <Error message={errors.customUrl} />}
              {error && <Error message={error.message} />}
              
              {/* Create button for mobile */}
              <Button
                type="button"
                variant=""
                onClick={createNewLink}
                disabled={loading}
                className="w-full rounded py-2 px-2 mt-2"
              >
                {loading ? <BeatLoader size={8} color="#8884d8" /> : "Create"}
              </Button>
            </div>
          </div>

          {/* Right Column - QR Customization */}
          <div className="relative flex flex-col gap-3 lg:border-l lg:pl-4">
            <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2">
              <h3 className="text-base sm:text-lg font-semibold">Customize QR</h3>
              {/* Only show controls when customization is visible */}
              {showCustomization && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="w-8 h-8 p-0"
                  >
                    <Undo2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="w-8 h-8 p-0"
                  >
                    <Redo2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="w-8 h-8 p-0"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {/* Only show toggle on small screens */}
              <button 
                onClick={() => setShowCustomization(prev => !prev)} 
                className="md:hidden p-1"
              >
                {showCustomization ? (
                  <ChevronUp className="w-4 h-4 transition duration-200" />
                ) : (
                  <ChevronDown className="w-4 h-4 transition duration-200" />
                )}
              </button>
            </div>
            
            {showCustomization && (
              <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[40vh] sm:max-h-[50vh] lg:max-h-none pb-4 px-1">
                {/* Color Pickers Grid with adjusted sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Background Color */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      <span className="text-sm font-medium">Background</span>
                    </label>
                    <div className="flex flex-col">
                      <HexColorPicker 
                        color={qrOptions.backgroundColor}
                        onChange={(color) => handleColorChange({ hex: color }, 'backgroundColor')}
                        style={{ width: '100%', height: '100px' }} // increased height from 80px to 100px
                      />
                      <div className="mt-1 sm:mt-2 flex items-center gap-2 h-8">
                        <div 
                          className="w-5 h-5 rounded border" // Adjusted size
                          style={{ backgroundColor: qrOptions.backgroundColor }}
                        />
                        <input
                          type="text"
                          value={qrOptions.backgroundColor}
                          onChange={(e) => handleColorChange({ hex: e.target.value }, 'backgroundColor')}
                          className="w-full p-1 text-xs sm:text-sm rounded border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* QR Code Color */}
                  <div className="space-y-1 sm:space-y-2">
                    <label className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      <span className="text-sm font-medium">QR Color</span>
                    </label>
                    <div className="flex flex-col">
                      <HexColorPicker 
                        color={qrOptions.foregroundColor}
                        onChange={(color) => handleColorChange({ hex: color }, 'foregroundColor')}
                        style={{ width: '100%', height: '100px' }} // increased height from 80px to 100px
                      />
                      <div className="mt-1 sm:mt-2 flex items-center gap-2 h-8">
                        <div 
                          className="w-5 h-5 rounded border" // Adjusted size
                          style={{ backgroundColor: qrOptions.foregroundColor }}
                        />
                        <input
                          type="text"
                          value={qrOptions.foregroundColor}
                          onChange={(e) => handleColorChange({ hex: e.target.value }, 'foregroundColor')}
                          className="w-full p-1 text-xs sm:text-sm rounded border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls Section with better mobile layout */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                 
                  <div className="space-y-2">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        <span className="text-sm font-medium">QR Box Shape</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {qrOptions.boxShape === 0 ? 'Square' : 
                        qrOptions.boxShape === 50 ? 'Circle' : 'Rounded'}
                      </span>
                    </label>
                    <Slider
                      defaultValue={[0]}
                      max={50}
                      step={1}
                      value={[qrOptions.boxShape]}
                      onValueChange={handleShapeChange}
                      className="w-full"
                    />
                  </div> */}

                  {/* Border Weight */}
                  {/* <div className="flex-1 space-y-2">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4" />
                        <span className="text-sm font-medium">Border Weight</span>
                      </div>
                      <span className="text-sm text-gray-500">{qrOptions.borderWidth}px</span>
                    </label>
                    <Slider
                      defaultValue={[2]}
                      min={0}
                      max={10}
                      step={1}
                      value={[qrOptions.borderWidth]}
                      onValueChange={handleBorderWeightChange}
                      className="w-full"
                    />
                  </div>
                </div> */}

                {/* Logo and Border Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium">
                      <Image className="w-4 h-4" />
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
                          className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
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
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
                              />
                            </>
                          ) : (
                            <Image className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                          )}
                        </label>
                        {qrOptions.logo && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQrOptionsChange({ ...qrOptions, logo: null });
                            }}
                            className="absolute top-0 right-[-10px] bg-red-500 rounded-full p-1"
                          >
                            <Trash className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Border Color */}
                  {/* <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      <span className="text-sm font-medium">Border Color</span>
                    </label>
                    <div className="flex flex-col">
                      <HexColorPicker 
                        color={qrOptions.borderColor}
                        onChange={(color) => handleColorChange({ hex: color }, 'borderColor')}
                        style={{ width: '100%', height: '100px' }} // increased height from 80px to 100px
                      />
                      <div className="mt-1 sm:mt-2 flex items-center gap-2 h-8">
                        <div 
                          className="w-5 h-5 rounded border" // Adjusted size
                          style={{ backgroundColor: qrOptions.borderColor }}
                        />
                        <input
                          type="text"
                          value={qrOptions.borderColor}
                          onChange={(e) => handleColorChange({ hex: e.target.value }, 'borderColor')}
                          className="w-full p-1 text-xs sm:text-sm rounded border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Pattern Section */}
                <div className="w-full space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <LayoutGrid className="w-4 h-4" />
                    <span>QR Pattern</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2"> {/* Changed from flex flex-col to grid grid-cols-2 */}
                    {patternOptions.map((pattern) => (
                      <Button
                        key={pattern.id}
                        variant={qrOptions.pattern === pattern.value ? "default" : "outline"}
                        className="py-2 px-2 text-xs rounded" // removed w-full as grid-cols-2 handles the width
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
  height: 80px !important;
}

.react-colorful__hue {
  height: 12px !important;
}

.react-colorful__saturation {
  height: 60px !important;
}

/* Add these new styles to make the dragging circle smaller */
.react-colorful__saturation-pointer,
.react-colorful__hue-pointer {
  width: 14px !important;
  height: 14px !important;
}

.react-colorful__saturation-pointer {
  border-width: 2px !important;
}

.react-colorful__hue-pointer {
  border-width: 2px !important;
}
`;

// Add style tag
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
