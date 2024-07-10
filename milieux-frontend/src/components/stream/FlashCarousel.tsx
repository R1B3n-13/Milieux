import { Card, CardContent } from "@/components/ui/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";
import Image from "next/image";
import PlusFilledIcon from "../icons/PlusFilledIcon";

export default function FlashCarousel() {
  const flashes = [
    { id: 1, title: "Story 1", imageUrl: "/images/story1.jpg" },
    { id: 2, title: "Story 2", imageUrl: "/images/story2.jpg" },
    { id: 3, title: "Story 3", imageUrl: "/images/story3.jpg" },
    { id: 4, title: "Story 4", imageUrl: "/images/story4.jpg" },
    { id: 5, title: "Story 5", imageUrl: "/images/story5.jpg" },
  ];

  return (
    <Carousel
      opts={{ loop: true, align: "start" }}
      className="flex items-center justify-center mt-5 w-full max-w-5xl"
    >
      <CarouselContent className="-ml-1">
        <CarouselItem className="pl-1 basis-1/5">
          <div className="p-1">
            <Card>
              <CardContent className="flex flex-col h-52 items-center justify-center px-0">
                <div className="w-full">
                  <Image
                    src="/user_placeholder.svg"
                    alt=""
                    width={500}
                    height={500}
                    className="translate-y-8"
                  />
                </div>

                <div className="text-blue-600 bg-white translate-y-3 rounded-full border-4 border-white cursor-pointer">
                  <PlusFilledIcon />
                </div>

                <p className="font-semibold translate-y-4 text-sm cursor-default">
                  Create a flash
                </p>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>

        {Array.from({ length: 6 }).map((_, index) => (
          <CarouselItem key={index} className="pl-1 basis-1/5">
            <div className="p-1">
              <Card>
                <CardContent className="flex w-52 aspect-square items-center py-6 px-0">
                  <span className="text-2xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
