import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const LandingPage = () => {


  const [longurl, setLongUrl] = useState();
  const navigate = useNavigate();

  const handleShorten = (e) => {
    e.preventDefault();
    if(longurl) navigate(`/auth?createNew=${longurl}`);
  };







  return (
    <div className="flex flex-col items-center ">
      <h2 className="my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        Your Shortcut to Smart Links
        <br />
        and Insights! 👇
      </h2>
      
      
      <form onSubmit={handleShorten} className="sm:h-14 flex flex-col  sm:flex-row w-full md:w-2/4 gap-2">
        <Input
          type="url"
          value={longurl}
          placeholder="Enter the looong URL"

          onChange={(e) => setLongUrl(e.target.value)}

          className="rounded h-full flex-1 py-4 px-4"
        />
        <Button className="rounded h-full  " type="submit" variant="destructive">
          Shorten!
        </Button>
      </form>
      <br />
      
      <div className="flex w-full justify-center items-center">
        <img
          src="banner.gif"
          alt="LOL LOL LOL LOL"
          className="pointer-events-none w-[70rem] "
        />
      </div>

      <br />
      <br />

      {/* FAQS and Video Section */}
      <div className="w-full flex flex-col md:flex-row gap-8 px-4 md:px-11">
        {/* FAQs Section */}
        <div className="w-full md:w-1/2 h-[500px] overflow-y-auto ">
          <h2 className="text-2xl font-extrabold mb-4 text-white border-b pb-2">
            Frequently Asked Questions
          </h2>
          <Accordion type="multiple" collapsible className="bg-gray-900/50 rounded-lg p-4">
            <AccordionItem value="item-2" className="border-b border-gray-700">
              <AccordionTrigger>What is LOL URL, and how does it work?</AccordionTrigger>
              <AccordionContent>
                LOL URL is a fun and easy-to-use URL-shortening service that lets you create short links, download QR codes, and track link analytics, including clicks and regional insights. Simply paste your long URL, hit shorten, and you're good to go!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-gray-700">
              <AccordionTrigger>Is LOL URL free to use?</AccordionTrigger>
              <AccordionContent>
                Yes! LOL URL offers free link shortening and basic analytics. For advanced features, you can explore our premium options.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-b border-gray-700">
              <AccordionTrigger>How can I track the performance of my shortened links?</AccordionTrigger>
              <AccordionContent>
                Every link comes with a detailed analytics dashboard where you can view click counts, regions of visitors, and more in real-time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-b border-gray-700">
              <AccordionTrigger>What formats are the QR codes available in?</AccordionTrigger>
              <AccordionContent>
                You can download your QR codes in high-quality PNG or SVG formats, making them perfect for digital and print use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Is my data safe with LOL URL?</AccordionTrigger>
              <AccordionContent>
                Absolutely! We prioritize your privacy and ensure your data is secure. Your links and analytics are only accessible to you unless you choose to share them.
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
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="LOL URL Demonstration"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;