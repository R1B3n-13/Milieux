import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import FeedCard from "./FeedCard";
import {
  getBBCFeeds,
  getESPNFeeds,
  getWiredFeeds,
} from "@/services/feed/feedService";
import FeedTabsWrapper from "./FeedTabsWrapper";

const FeedTabs = async () => {
  const bbcFeedPromise = getBBCFeeds();
  const wiredFeedPromise = getWiredFeeds();
  const ESPNFeedPromise = getESPNFeeds();

  const [bbcFeedItems, wiredFeedItems, ESPNFeedItems] = await Promise.all([
    bbcFeedPromise,
    wiredFeedPromise,
    ESPNFeedPromise,
  ]);

  return (
    <FeedTabsWrapper>
      <Tabs defaultValue="bbci" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bbci">BBC</TabsTrigger>
          <TabsTrigger value="wired">Wired</TabsTrigger>
          <TabsTrigger value="espn">ESPN</TabsTrigger>
        </TabsList>

        <TabsContent value="bbci">
          <Card className="max-h-[calc(100vh-12em)] overflow-y-auto bg-muted shadow-md">
            <CardContent className="space-y-2">
              {bbcFeedItems.map((feed, index) => (
                <FeedCard key={index} feed={feed} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wired">
          <Card className="max-h-[calc(100vh-12em)] overflow-y-auto bg-muted shadow-md">
            <CardContent className="space-y-2">
              {wiredFeedItems.map((feed, index) => (
                <FeedCard key={index} feed={feed} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="espn">
          <Card className="max-h-[calc(100vh-12em)] overflow-y-auto bg-muted shadow-md">
            <CardContent className="space-y-2">
              {ESPNFeedItems.map((feed, index) => (
                <FeedCard key={index} feed={feed} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FeedTabsWrapper>
  );
};

export default FeedTabs;
