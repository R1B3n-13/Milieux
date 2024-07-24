import { getAllFlash } from "@/services/flashService";
import FlashCarousel from "./FlashCarousel";
import { getUserFromAuthToken } from "@/services/userService";

const FlashCarouselCaller = async () => {
  const flashResponsePromise = getAllFlash();
  const loggedInUserResponsePromise = getUserFromAuthToken();

  const [flashResponse, loggedInUserResponse] = await Promise.all([
    flashResponsePromise,
    loggedInUserResponsePromise,
  ]);

  return (
    <FlashCarousel
      flashes={flashResponse.reels}
      user={loggedInUserResponse.user}
    />
  );
};

export default FlashCarouselCaller;
