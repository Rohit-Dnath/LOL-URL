import { useEffect, useState } from "react";
import Error from "./error";
import { Input } from "./ui/input";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signup } from "@/db/apiAuth";
import { BeatLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import defaultProfilePic from "@/assets/profile_img.jpg";
import emailjs from "emailjs-com";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: defaultProfilePic,
  });
  const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


  const [errors, setErrors] = useState({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [emailVerificationMessage, setEmailVerificationMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiryTime, setOtpExpiryTime] = useState(null);

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, loading, data, longLink, navigate]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    if (otpExpiryTime) {
      const interval = setInterval(() => {
        if (new Date() > otpExpiryTime) {
          setGeneratedCode("");
          setEmailVerificationMessage("OTP expired. Please request a new one.");
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpExpiryTime]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const sendVerificationCode = async () => {
    if (!formData.email) {
      setErrors({ email: "Please enter an email first" });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setOtpExpiryTime(new Date(Date.now() + 5 * 60 * 1000)); // 5 mins expiry
    setResendCooldown(60); // 60 sec cooldown

    try {
      await emailjs.send(
        serviceID,
        templateID,
        { to_email: formData.email, code },
        publicKey
      );

      setEmailVerificationMessage("Verification code sent to your email.");
      setErrors((prev) => ({ ...prev, email: null }));
    } catch (err) {
      console.error("Email sending failed", err);
      setErrors({ email: "Failed to send verification code." });
    }
  };

  const verifyEnteredCode = () => {
    if (!generatedCode) {
      setErrors({ verificationCode: "OTP has expired. Request a new one." });
      return;
    }

    if (verificationCode === generatedCode) {
      setIsEmailVerified(true);
      setEmailVerificationMessage("Email verified successfully!");
      setErrors((prev) => ({ ...prev, verificationCode: null }));
    } else {
      setErrors({ verificationCode: "Incorrect verification code." });
    }
  };

  const handleSignup = async () => {
    setErrors({});

    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        profile_pic: Yup.mixed(),
      });

      await schema.validate(formData, { abortEarly: false });

      if (!isEmailVerified) {
        setErrors({ email: "Please verify your email before signing up." });
        return;
      }

      // Always use default profile picture
      const signupData = {
        ...formData,
        profile_pic: defaultProfilePic
      };

      await fnSignup(signupData);
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ api: error.message });
      }
    }
  };

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create a new account</CardDescription>
        {error && <Error message={error?.message} />}
      </CardHeader>

      <CardContent className="space-y-2">
        <Input name="name" placeholder="Enter Name" onChange={handleInputChange} />
        {errors.name && <Error message={errors.name} />}

        <Input name="email" placeholder="Enter Email" type="email" onChange={handleInputChange} />
        <Button onClick={sendVerificationCode} disabled={!formData.email || resendCooldown > 0}>
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Send Verification Code"}
        </Button>
        {emailVerificationMessage && (
          <p className="text-sm text-green-600">{emailVerificationMessage}</p>
        )}
        {errors.email && <Error message={errors.email} />}

        {generatedCode && !isEmailVerified && (
          <>
            <Input
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button onClick={verifyEnteredCode}>Verify Code</Button>
            {errors.verificationCode && <Error message={errors.verificationCode} />}
          </>
        )}

        {isEmailVerified && <p className="text-sm text-green-600"> </p>}

        <Input name="password" type="password" placeholder="Enter Password" onChange={handleInputChange} />
        {errors.password && <Error message={errors.password} />}

        <input name="profile_pic" type="file" accept="image/*" onChange={handleInputChange} />

        <div className="space-y-1">
          {/* <input
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
          /> */}
        </div>

        {errors.profile_pic && <Error message={errors.profile_pic} />}
      </CardContent>

      <CardFooter>
        <Button onClick={handleSignup}>
          {loading ? <BeatLoader size={10} color="#8884d8" /> : "Create Account"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
