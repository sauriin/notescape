import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    memberships: defineTable({
        orgId: v.string(),
        userId: v.string(),
    }).index("by_orgId_userId", ["orgId", "userId"]),

    documents: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        tokenIdentifier: v.optional(v.string()),
        orgId: v.optional(v.string()),
        fileId: v.id("_storage"),
    }).
        index('by_tokenIdentifier', ['tokenIdentifier'])
        .index('by_orgId', ["orgId"]),

    notes: defineTable({
        text: v.string(),
        orgId: v.optional(v.string()),
        tokenIdentifier: v.optional(v.string()),
    })
        .index('by_tokenIdentifier', ['tokenIdentifier'])
        .index("by_orgId", ["orgId"])
});

//4 hr 57 min 22 sec    