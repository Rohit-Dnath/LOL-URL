import { cn } from "@/lib/utils";
import {
  IconLink,
  IconChartLine,
  IconEdit,
  IconTargetArrow,
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
        "Track clicks, locations, engagement and devices in real-time to gain actionable insights.",
      icon: <IconChartLine />,
    },
    {
      title: "Customizable URLs",
      description:
        "Create personalized URLs that align with your branding and campaigns.",
      icon: <IconEdit />,
    },
    {
      title: "Campaign Tracking",
      description:
        "Track the performance of marketing campaigns effortlessly with detailed metrics.",
      icon: <IconTargetArrow />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 py-6 max-w-5xl mx-auto px-4">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({ title, description, icon, index }) => {
  return (
    <div className="group/feature bg-gray-900/50 hover:bg-gray-900/70 border border-gray-800 hover:border-gray-700 rounded-xl p-6 transition-all duration-300 h-full">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gray-800/50 rounded-lg text-white">{icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2 group-hover/feature:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
};
