import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "refresh Shopify product prices",
  { hours: 24 },
  internal.shopify.refreshAllProductPrices,
);

export default crons;
