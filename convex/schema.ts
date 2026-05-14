import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const timestamps = {
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
};

export default defineSchema({
  users: defineTable({
    email: v.string(),
    username: v.optional(v.string()),
    lastLoginAt: v.optional(v.number()),
    labelLiveDesignName: v.optional(v.string()),
    labelLivePrinterId: v.optional(v.string()),
    ...timestamps,
  })
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  groups: defineTable({
    userId: v.id("users"),
    name: v.string(),
    ...timestamps,
  })
    .index("by_user", ["userId"]),

  products: defineTable({
    userId: v.id("users"),
    sku: v.optional(v.string()),
    upc: v.optional(v.string()),
    name: v.string(),
    img: v.optional(v.string()),
    type: v.optional(v.string()),
    vendor: v.optional(v.string()),
    price: v.number(),
    meta: v.optional(v.any()),
    ...timestamps,
  })
    .index("by_user", ["userId"])
    .index("by_user_sku", ["userId", "sku"])
    .index("by_user_upc", ["userId", "upc"]),

  productGroups: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    groupId: v.id("groups"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_product", ["productId"])
    .index("by_group", ["groupId"])
    .index("by_group_product", ["groupId", "productId"]),

  printData: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    lastPrintedAt: v.optional(v.number()),
    lastPrintedPrice: v.optional(v.number()),
    ...timestamps,
  })
    .index("by_user", ["userId"])
    .index("by_product", ["productId"])
    .index("by_user_product", ["userId", "productId"]),

  printJobs: defineTable({
    userId: v.id("users"),
    groupId: v.optional(v.id("groups")),
    scope: v.union(
      v.literal("all"),
      v.literal("out-of-date"),
      v.literal("unprinted"),
      v.literal("single"),
    ),
    status: v.union(v.literal("active"), v.literal("undone")),
    createdAt: v.number(),
    undoneAt: v.optional(v.number()),
    lineItems: v.array(
      v.object({
        productId: v.id("products"),
        hadPrintDataRowBefore: v.boolean(),
        previousLastPrintedAt: v.optional(v.number()),
        previousLastPrintedPrice: v.optional(v.number()),
        printedAt: v.number(),
        printedPrice: v.number(),
      }),
    ),
  })
    .index("by_user", ["userId"])
    .index("by_group", ["groupId"])
    .index("by_user_status_created", ["userId", "status", "createdAt"]),

  shopifyConnections: defineTable({
    userId: v.id("users"),
    shopDomain: v.string(),
    accessToken: v.string(),
    scopes: v.array(v.string()),
    isActive: v.boolean(),
    lastSyncAt: v.optional(v.number()),
    ...timestamps,
  })
    .index("by_user", ["userId"])
    .index("by_shop_domain", ["shopDomain"])
    .index("by_user_shop_domain", ["userId", "shopDomain"]),

  shopifyOAuthStates: defineTable({
    userId: v.id("users"),
    shopDomain: v.string(),
    state: v.string(),
    expiresAt: v.number(),
    consumedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_state", ["state"])
    .index("by_user", ["userId"]),

  passkeys: defineTable({
    userId: v.id("users"),
    credentialId: v.string(),
    publicKey: v.string(),
    signCount: v.number(),
    transports: v.optional(v.array(v.string())),
    deviceName: v.optional(v.string()),
    createdAt: v.number(),
    lastUsedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_credential_id", ["credentialId"]),

  emailOtps: defineTable({
    email: v.string(),
    codeHash: v.string(),
    purpose: v.union(v.literal("passkey_setup"), v.literal("login")),
    expiresAt: v.number(),
    consumedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_email_purpose", ["email", "purpose"]),

  authChallenges: defineTable({
    userId: v.optional(v.id("users")),
    email: v.optional(v.string()),
    challenge: v.string(),
    purpose: v.union(v.literal("passkey_setup"), v.literal("login")),
    expiresAt: v.number(),
    consumedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"])
    .index("by_challenge", ["challenge"]),

  authSessions: defineTable({
    userId: v.id("users"),
    tokenHash: v.string(),
    expiresAt: v.number(),
    revokedAt: v.optional(v.number()),
    createdAt: v.number(),
    lastSeenAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_token_hash", ["tokenHash"]),
});
