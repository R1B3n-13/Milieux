import { getAllFlash } from "@/services/flashService";
import FlashCarousel from "./FlashCarousel";

const FlashCarouselCaller = async () => {
  const flashResponse = await getAllFlash();

  return <FlashCarousel flashes={flashResponse.reels} />;
};

export default FlashCarouselCaller;
