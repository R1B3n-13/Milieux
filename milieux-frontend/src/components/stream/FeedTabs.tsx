import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import FeedCard from "./FeedCard";
import feedItems from "./items/feedItems";

export function FeedTabs() {
  return (
    <Tabs
      defaultValue="bbci"
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="bbci">BBC</TabsTrigger>
        <TabsTrigger value="wired">Wired</TabsTrigger>
        <TabsTrigger value="espn">ESPN</TabsTrigger>
      </TabsList>

      <TabsContent value="bbci">
        <Card className="overflow-y-scroll max-h-56">
          <CardContent className="space-y-2">
            {feedItems.bbci.map((feed, index) => (
              <FeedCard key={index} feed={feed} />
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="wired">
        <Card className="overflow-y-scroll max-h-56">
          <CardContent className="space-y-2">
            {feedItems.wired.map((feed, index) => (
              <FeedCard key={index} feed={feed} />
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="espn">
        <Card className="overflow-y-scroll max-h-56">
          <CardContent className="space-y-2">
            {feedItems.espn.map((feed, index) => (
              <FeedCard key={index} feed={feed} />
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
