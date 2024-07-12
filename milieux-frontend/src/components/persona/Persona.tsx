import Image from "next/image";
import { Button } from "../ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import PersonaPostList from "./PersonaPostList";
import AboutCard from "./AboutCard";
import PostCreationCard from "../common/PostCreationCard";

const Persona = async () => {
  return (
    <div className="flex flex-col mt-5 w-[68%] min-h-screen">
      <div className="relative h-[27rem] z-30">
        <Image
          src="https://r4.wallpaperflare.com/wallpaper/955/962/485/guitar-wallpaper-b394dd6d8c38d1af01c5d786248c78e2.jpg"
          alt=""
          layout="fill"
          className="object-cover rounded-t-xl"
        />
      </div>

      <div className="relative w-full flex flex-col items-start justify-center -mt-24 bg-zinc-100 pb-3">
        <div className="flex flex-col items-center justify-center ml-12">
          <div className="relative w-[12rem] h-[12rem] z-40">
            <Image
              src="https://r4.wallpaperflare.com/wallpaper/365/244/884/uchiha-itachi-naruto-shippuuden-anbu-silhouette-wallpaper-798098ed01dacd1ba697c8bfe011d61d.jpg"
              alt=""
              layout="fill"
              className="object-cover rounded-full border-[6px] border-zinc-100"
            />
          </div>
          <p className="relative flex items-start justify-start mt-4 text-xl font-semibold">
            User Name
          </p>
        </div>
      </div>

      <div className="flex items-end justify-end -mt-[8.3rem] mr-12">
        <Button
          variant="outline"
          className="w-32 rounded-full border border-gray-400 text-slate-600 text-md font-medium hover:bg-gray-100 cursor-pointer z-50"
        >
          Edit persona
        </Button>
      </div>

      <Tabs defaultValue="posts" className="w-full mt-20 z-40">
        <div className="flex justify-center">
          <TabsList className="gap-5 w-full bg-zinc-100 border-b-2 border-zinc-200 rounded-b-xl p-2">
            <TabsTrigger
              value="posts"
              className="w-24 ml-7 py-2 font-semibold bg-transparent rounded-none focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-b-blue-600"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="w-24 py-2 font-semibold bg-transparent rounded-none focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-b-blue-600"
            >
              Photos
            </TabsTrigger>
            <TabsTrigger
              value="videos"
              className="w-24 py-2 font-semibold bg-transparent rounded-none focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-b-blue-600"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="w-24 py-2 font-semibold bg-transparent rounded-none focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-b-blue-600"
            >
              Bookmarks
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts">
          <div className="grid grid-cols-5">
            <div className="col-span-2 mt-2">
              <AboutCard />
            </div>
            <div className="col-span-3 flex flex-col items-center justify-center gap-4 mt-2 ml-4">
              <PostCreationCard />
              <PersonaPostList id={null} />
            </div>
          </div>
        </TabsContent>

        {/* <TabsContent value="photos"></TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Persona;
