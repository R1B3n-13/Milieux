import React, { Suspense } from "react";

const FeedTabsWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
);

export default FeedTabsWrapper;
