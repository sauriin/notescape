import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    documents: defineTable({
        title: v.string(),
        description: v.string(),
        tokenIdentifier: v.string(),
        fileId: v.id("_storage"),
    }).index('by_tokenIdentifier', ['tokenIdentifier']),
    notes: defineTable({
        text: v.string(),
        tokenIdentifier: v.string(),
    }).index('by_tokenIdentifier', ['tokenIdentifier']),
});