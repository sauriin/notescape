import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"


export const getDocuments = query({
    async handler(ctx) {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            return [];
        }
        return await ctx.db.query('documents')
            .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier',
                userId)).collect()
    }
})

export const createDocument = mutation({
    args: {
        title: v.string(),
    },
    async handler(ctx, args) {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            throw new ConvexError('no authenicated user')
        }
        await ctx.db.insert('documents', {
            title: args.title,
            tokenIdentifier: userId
        })
    },
})

// 27 min 49 sec