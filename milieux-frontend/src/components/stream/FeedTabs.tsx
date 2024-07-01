import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import FeedCard from "./FeedCard";
import {
  getBBCFeeds,
  getESPNFeeds,
  getWiredFeeds,
} from "@/services/feedService";
import FeedTabsWrapper from "./FeedTabsWrapper";

const FeedTabs = async () => {
  const bbcFeedPromise = getBBCFeeds();
  const wiredFeedPromise = getWiredFeeds();
  const espnFeedPromise = getESPNFeeds();

  const [bbcFeedItems, wiredFeedItems, espnFeedItems] = await Promise.all([
    bbcFeedPromise,
    wiredFeedPromise,
    espnFeedPromise,
  ]);

  return (
    <FeedTabsWrapper>
      <Tabs defaultValue="bbci" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-200">
          <TabsTrigger value="bbci" className="font-semibold text-slate-700">
            BBC
          </TabsTrigger>
          <TabsTrigger value="wired" className="font-semibold text-slate-700">
            Wired
          </TabsTrigger>
          <TabsTrigger value="espn" className="font-semibold text-slate-700">
            ESPN
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bbci">
          <Card className="max-h-[calc(100vh-12em)] overflow-y-auto bg-white shadow-md">
            <CardContent className="space-y-2">
              {bbcFeedItems.map((feed, index) => (
                <FeedCard key={index} feed={feed} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wired">
          <Card className="max-h-[calc(100vh-12em)] overflow-y-auto bg-white shadow-md">
            <CardContent className="space-y-2">
              {wiredFeedItems.map((feed, index) => (
                <FeedCard key={index} feed={feed} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="espn">
          <Card className="max-h-[calc(100vh-12em)] overflow-y-auto bg-white shadow-md">
            <CardContent className="space-y-2">
              {espnFeedItems.map((feed, index) => (
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
