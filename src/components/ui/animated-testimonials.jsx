"use client";;
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
import { useEffect, useState } from "react";

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };
  return (
    <div className={`${className} mx-auto`}>
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-105"
        >
          <p className="text-sm sm:text-base text-gray-300 italic">"{testimonial.quote}"</p>
          <div className="flex items-center gap-3">
            <img
              src={testimonial.src}
              alt={testimonial.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white">{testimonial.name}</h3>
              <p className="text-xs sm:text-sm text-gray-400">{testimonial.designation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
