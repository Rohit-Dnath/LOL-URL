// Mock API for Clicks - Replace with your Prisma/Neon backend API calls
import { UAParser } from "ua-parser-js";

export const getClicksForUrls = async (urlIds) => {
  // TODO: Replace with actual API call
  console.log('getClicksForUrls called:', urlIds);
  
  const allClicks = JSON.parse(localStorage.getItem('clicks') || '[]');
  return allClicks.filter(click => urlIds.includes(click.url_id));
};

export const getClicksForUrl = async (url_id) => {
  // TODO: Replace with actual API call
  console.log('getClicksForUrl called:', url_id);
  
  const allClicks = JSON.parse(localStorage.getItem('clicks') || '[]');
  return allClicks.filter(click => click.url_id === url_id);
};

const parser = new UAParser();

export const storeClicks = async ({ id, originalUrl }) => {
  try {
    const res = parser.getResult();
    const device = res.device.type || "desktop";

    const response = await fetch("https://ipapi.co/json");
    const { city, country_name: country } = await response.json();

    // Store click in localStorage (replace with API call)
    const allClicks = JSON.parse(localStorage.getItem('clicks') || '[]');
    allClicks.push({
      id: Date.now().toString(),
      url_id: id,
      city: city,
      country: country,
      device: device,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('clicks', JSON.stringify(allClicks));

    window.location.href = originalUrl;
  } catch (error) {
    console.error("Error recording click:", error);
    // Still redirect even if tracking fails
    window.location.href = originalUrl;
  }
};

