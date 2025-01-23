import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spotlight } from "@/components/ui/spotlight";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
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
        "LOL URL has been a game-changer for our community events. Tracking clicks, devices, and locations has allowed us to optimize our outreach and improve member engagement.",
      name: "Souradip Pal",
      designation: "Intern @ISRO and Founder of DEV DOT COM Community",
      src: "https://media.licdn.com/dms/image/v2/D5603AQGLkU9jK4qPzw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1692735696303?e=1743033600&v=beta&t=Hk-99ss4lmtAsdtUr33lkw9fO0vJTq1Y6zubQ4Ke8GA",
    },
    {
      quote:
        "Using LOL URL has made sharing and managing links so simple. The analytics are super helpful for understanding how our links are performing.",
      name: "Subhadip Saha",
      designation: "Intern @ISRO and Game Developer",
      src: "https://media.licdn.com/dms/image/v2/D5603AQFw6_WaZHprJg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731342122024?e=1743033600&v=beta&t=2ztJi_FyS3CcJbLr4UNBY2Kslz-9jrrQJ8Vr5PYldas",
    },
    {
      quote:
        "LOL URL’s intuitive design makes it perfect for students like us. Shortening and tracking links has never been this straightforward.",
      name: "Ayush Dhua",
      designation: "Ex. Intern @Goldman Sachs",
      src: "https://media.licdn.com/dms/image/v2/D5603AQEe4gNcGNgwDQ/profile-displayphoto-shrink_400_400/B56ZOvMfApGwAk-/0/1733811107135?e=1743033600&v=beta&t=j9Y6npQTna2NbU6SFIrQRMhaTPUiGKrbOqKNvOmS-iM",
    },
    {
      quote:
        "The simplicity and smart features of LOL URL make it an essential tool for students. It’s easy to use and incredibly effective.",
      name: "Subinoy Biswas",
      designation: "Intern @ISRO and SIH Winner",
      src: "./subinoy.png",
    },
  ];

  return (
    <div className="flex flex-col items-center  ">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        <span className="inline">Your Shortcut to </span>
        <span className="inline">
          <SparklesText
            className="inline sm:text-6xl text-white font-extrabold"
            text="Smart Links"
          />
        </span>
        <span className="inline"> and Insights! 👇</span>
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
      <br />
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

      <h2 className="text-4xl font-extrabold mb-4 text-white border-b pb-2 zindex-100">
        Features
      </h2>
      <FeaturesSectionDemo className="grid" />

      <br />
      <br />

      <h2 className="text-3xl font-extrabold mb-4 text-white border-b pb-2 zindex-100">
        Testimonials
      </h2>
      <AnimatedTestimonials testimonials={testimonials} className="start" />
      <br />
      <br />

      <VelocityScroll>LOL THE URL •</VelocityScroll>

      <br />
      <br />
      <br />
      <br />

      {/* FAQS and Video Section */}
      <div className="w-full flex flex-col md:flex-row gap-8 px-4 md:px-11">
        {/* FAQs Section */}
        <div className="w-full md:w-1/2 h-[500px] overflow-y-auto ">
          <h2 className="text-2xl font-extrabold mb-4 text-white border-b pb-2">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="multiple"
            collapsible
            className="bg-gray-900/50 rounded-lg p-4"
          >
            <AccordionItem value="item-2" className="border-b border-gray-700">
              <AccordionTrigger>
                What is LOL URL, and how does it work?
              </AccordionTrigger>
              <AccordionContent>
                LOL URL is a fun and easy-to-use URL-shortening service that
                lets you create short links, download QR codes, and track link
                analytics, including clicks and regional insights. Simply paste
                your long URL, hit shorten, and you're good to go!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-gray-700">
              <AccordionTrigger>Is LOL URL free to use?</AccordionTrigger>
              <AccordionContent>
                Yes! LOL URL offers free link shortening and basic analytics.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-gray-700">
              <AccordionTrigger>
                How can I track the performance of my shortened links?
              </AccordionTrigger>
              <AccordionContent>
                Every link comes with a detailed analytics dashboard where you
                can view click counts, regions of visitors, and more in
                real-time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-gray-700">
              <AccordionTrigger>
                What formats are the QR codes available in?
              </AccordionTrigger>
              <AccordionContent>
                You can download your QR codes in high-quality PNG or SVG
                formats, making them perfect for digital and print use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Is my data safe with LOL URL?</AccordionTrigger>
              <AccordionContent>
                Absolutely! We prioritize your privacy and ensure your data is
                secure. Your links and analytics are only accessible to you
                unless you choose to share them.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Video Section */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-extrabold mb-4 text-white border-b pb-2">
            See How It Works
          </h2>
          <div className="h-[316px] rounded-lg overflow-hidden shadow-xl">
            <HeroVideoDialog
              className="dark:hidden block z-index-10000000"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
              thumbnailAlt="Hero Video"
            />
            <HeroVideoDialog
              className="hidden dark:block z-index-10000000"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
              thumbnailAlt="Hero Video"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
