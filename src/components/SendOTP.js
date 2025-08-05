import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const SendOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Generate 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = () => {
    const newOtp = generateOTP();
    setOtp(newOtp);

    const templateParams = {
      to_email: email,  // This must match the variable in your EmailJS template
      code: newOtp      // This too
    };

    emailjs
      .send(
        emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )

      )
      .then((response) => {
        console.log("OTP sent successfully", response.status, response.text);
        alert(`OTP sent to ${email}`);
      })
      .catch((err) => {
        console.error("Failed to send OTP", err);
        alert("Failed to send OTP. Please try again.");
      });
  };

  return (
    <div>
      <h2>Send OTP</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendOTP}>Send OTP</button>
    </div>
  );
};

export default SendOTP;
