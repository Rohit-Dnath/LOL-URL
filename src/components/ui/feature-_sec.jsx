import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconChartLine,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconEdit,
  IconFlask,
  IconFlask2,
  IconGraph,
  IconHeart,
  IconHelp,
  IconLink,
  IconRouteAltLeft,
  IconShieldCheck,
  IconTargetArrow,
  IconTerminal2,
  IconTrash,
} from "@tabler/icons-react";

export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Smart Link Shortening",
      description:
        "Shorten your links with ease and make them look clean and professional.",
      icon: <IconLink />,
    },
    {
      title: "Real-Time Analytics",
      description:
        "Track clicks, locations, and devices in real-time to gain actionable insights.",
      icon: <IconChartLine />,
    },
    {
      title: "Customizable URLs",
      description:
        "Create personalized URLs that align with your branding and campaigns.",
      icon: <IconEdit />,
    },
    {
      title: "Secure and Reliable",
      description: "Enjoy a secure platform with 100% uptime for your links.",
      icon: <IconShieldCheck />,
    },
    {
      title: "Campaign Tracking",
      description:
        "Track the performance of marketing campaigns effortlessly with detailed metrics.",
      icon: <IconTargetArrow />,
    },
    {
      title: "Advanced Insights",
      description:
        "Go beyond basic analytics with advanced insights into user behavior.",
      icon: <IconGraph />,
    },
    {
      title: "Link Deletion",
      description:
        "Easily delete links when they are no longer needed, maintaining control over your content.",
      icon: <IconTrash />,
    },
    {
      title: "A/B Testing",
      description:
        "Optimize your campaigns with A/B testing to determine the most effective links and strategies.",
      icon: <IconFlask2  />,
    },
  ];
  
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({ title, description, icon, index }) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t  dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b  dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10  text-white">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full  dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
