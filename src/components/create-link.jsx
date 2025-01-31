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
      <DialogContent className="sm:max-w-md rounded bg-background ">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New Link</DialogTitle>
        </DialogHeader>
        
        {formValues?.customUrl && (
          <QRCode ref={ref} size={250} value={`${window.location.origin}/${formValues.customUrl}`} />
        )}

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
          <p className={`text-sm mt-1 ${
            urlAvailable ? "text-green-500" : "text-red-500"
          }`}>
            {urlAvailable ? "✓ URL is available" : "✗ URL is not available"}
          </p>
        )}
        {errors.customUrl && <Error message={errors.customUrl} />}
        {error && <Error message={errors.message} />}
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant=""
            onClick={createNewLink}
            disabled={loading}
            className="rounded"
          >
            {loading ? <BeatLoader size={10} color="#8884d8" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLink;

