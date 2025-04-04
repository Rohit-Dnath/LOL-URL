import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spotlight } from "@/components/ui/spotlight";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { FeaturesSectionDemo } from "@/components/ui/feature-_sec";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";
import { SparklesText } from "@/components/ui/sparkles-text";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Globe } from "@/components/ui/globe";
import { Tweet } from "react-tweet";

const LandingPage = () => {
  const [longurl, setLongUrl] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLongUrl(e.target.value);
  };

  const placeholders = [
    "https://www.example.com/this-is-a-very-long-url-example",
    "https://www.anotherexample.com/another-very-long-url",
    "https://www.yetanotherexample.com/yet-another-long-url",
  ];

  const testimonials = [
    {
      quote:
        "lolurl.site has been a game-changer for our community events. Tracking clicks, devices, and locations has allowed us to optimize our outreach and improve member engagement.",
      name: "Souradip Pal",
      designation: "Intern @ ISRO and Founder of DEV DOT COM Community",
      src: "https://media.licdn.com/dms/image/v2/D5603AQGLkU9jK4qPzw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1692735696303?e=1743033600&v=beta&t=Hk-99ss4lmtAsdtUr33lkw9fO0vJTq1Y6zubQ4Ke8GA",
    },
    {
      quote:
        "Using lolurl.site has made sharing and managing links so simple. The analytics are super helpful for understanding how our links are performing.",
      name: "Subhadip Saha",
      designation: "Intern @ ISRO and Game Developer",
      src: "https://media.licdn.com/dms/image/v2/D5603AQFw6_WaZHprJg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731342122024?e=1743033600&v=beta&t=2ztJi_FyS3CcJbLr4UNBY2Kslz-9jrrQJ8Vr5PYldas",
    },
    {
      quote:
        "lolurl.site’s intuitive design makes it perfect for students like us. Shortening and tracking links has never been this straightforward.",
      name: "Ayush Dhua",
      designation: "Ex. Intern @ Goldman Sachs",
      src: "https://media.licdn.com/dms/image/v2/D5603AQEe4gNcGNgwDQ/profile-displayphoto-shrink_400_400/B56ZOvMfApGwAk-/0/1733811107135?e=1743033600&v=beta&t=j9Y6npQTna2NbU6SFIrQRMhaTPUiGKrbOqKNvOmS-iM",
    },
    {
      quote:
        "The simplicity and smart features of lolurl.site make it an essential tool for students. It’s easy to use and incredibly effective.",
      name: "Subinoy Biswas",
      designation: "Intern @ ISRO and SIH Winner",
      src: "./subinoy.png",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <h2 className="my-10 sm:my-16 text-3xl sm:text-4xl lg:text-6xl text-white text-center font-extrabold">
        <span className="inline">Your Shortcut to Smart </span>
        <span className="inline">
          <SparklesText
            className={`inline text-3xl sm:text-4xl lg:text-6xl text-white font-extrabold`}
            text="LOL Urls"
          />
        </span>
        <span className="inline"> and Insights ▼</span>
      </h2>

      <ScrollProgress className="w-full" />

      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={() => {
          setTimeout(() => {
            if (longurl) navigate(`/auth?createNew=${longurl}`);
          }, 1000);
        }}
      />

      {/* Product Hunt part */}

      {/* <div className="mt-4">
        <a 
          href="https://www.producthunt.com/posts/lol-url?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-lol&#0045;url" 
          target="_blank"
        >
          <img 
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=932417&theme=light&t=1740924853295" 
            alt="LOL&#0032;URL - Your&#0032;Shortcut&#0032;to&#0032;Smart&#0032;LOL&#0032;Urls&#0032;and&#0032;Insights | Product Hunt" 
            style={{ width: "250px", height: "54px" }}
            width="250" 
            height="54" 
          />
        </a>
      </div> */}

      <br />
      

      <div className="relative flex w-full max-w-full items-center justify-center overflow-hidden rounded-lg border bg-background bg-opacity-80 px-8 pb-32 pt-16 md:pb-60 md:pt-32 md:shadow-xl">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-white bg-clip-text text-center text-4xl font-semibold leading-none text-transparent dark:to-slate-900/10">
          Track Your Smart Links Globally
        </span>
        <Globe className="top-28 mt-8 w-128 h-128 md:w-160 md:h-160" />{" "}
        {/* Added mt-8 for gap and increased globe size */}
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </div>

      <br />
      <br />
      <br />

      <h2 className="text-4xl font-extrabold mb-8 text-white border-b pb-2 zindex-100">
        Features
      </h2>
      <div className="w-full max-w-4xl mx-auto px-4">
        <FeaturesSectionDemo />
      </div>

      <br />
      <br />


      {/* Testimonials Part */}

      {/* <h2 className="text-3xl font-extrabold mb-4 text-white border-b pb-2 z-30 px-4 text-center">
        Testimonials
      </h2>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-30 relative">
        <AnimatedTestimonials
          testimonials={testimonials}
          className="start z-30 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        />
      </div> */}
      <br />
      <br />

      <VelocityScroll>LOL THE URL •</VelocityScroll>

      <br />
      <br />
      <br />
      <br />

      {/* FAQS and tweet */}
      <div className="w-full flex flex-col md:flex-row gap-8 px-4  md:px-8 items-start justify-center max-w-[100vw] overflow-x-hidden">
        {/* FAQs Section */}
        <div className="w-full md:w-1/2 rounded-lg p-2 md:p-4">
          <h2 className="text-xl font-extrabold mb-4 text-white border-b pb-2">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="multiple"
            collapsible
            className="bg-gray-900/50 rounded-lg p-2 md:p-4 text-xl"
          >
            <AccordionItem value="item-1" className="border-b border-gray-700">
              <AccordionTrigger>What is LOL URL?</AccordionTrigger>
              <AccordionContent>
                LOL URL is a tool to shorten links, generate QR codes, and track
                link performance like clicks, devices, and locations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-gray-700">
              <AccordionTrigger>How do I shorten a link?</AccordionTrigger>
              <AccordionContent>
                Simply paste your long URL into the input box, click "Shorten,"
                and get a clean, shareable link instantly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-gray-700">
              <AccordionTrigger>
                Can I track my links?
              </AccordionTrigger>
              <AccordionContent>
                Yes! Each link includes a dashboard to monitor clicks, visitor
                locations, and devices in real-time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-gray-700">
              <AccordionTrigger>Can I customize my links?</AccordionTrigger>
              <AccordionContent>
                Yes, you can create personalized URLs that match your branding
                or campaigns.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-gray-700">
              <AccordionTrigger>What are QR code formats?</AccordionTrigger>
              <AccordionContent>
                QR codes can be downloaded in high-quality PNG or SVG formats
                for digital and print use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-b border-gray-700">
              <AccordionTrigger>Is my data safe with LOL URL?</AccordionTrigger>
              <AccordionContent>
                Absolutely! We prioritize privacy and ensure your data is secure
                and accessible only to you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-b border-gray-700">
              <AccordionTrigger>Is LOL URL free to use?</AccordionTrigger>
              <AccordionContent>
                Yes! LOL URL offers free link shortening and basic analytics.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border-b border-gray-700">
              <AccordionTrigger>
              How to track url performance?
              </AccordionTrigger>
              <AccordionContent>
                You can track clicks, location, and engagement through your
                dashboard after shortening a URL.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-9" className="border-b border-gray-700">
              <AccordionTrigger>
              Can I customize my links?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can create custom short links to match your branding or
                content.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* tweet Section */}
        <div className="w-full md:w-[35%] flex flex-col justify-start">
          <Tweet className="shadow-xl max-w-full" id="1885504095181770973" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
