import { ConvexError, v } from "convex/values"
import { action, mutation, query } from "./_generated/server"
import { api } from './_generated/api'

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
})

export const getDocuments = query({
    async handler(ctx) {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            return undefined;
        }
        return await ctx.db.query('documents')
            .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier',
                userId)).collect()
    }
})

export const getDocument = query({
    args: {
        documentId: v.id('documents'),
    },
    async handler(ctx, args) {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            return null;
        }

        const document = await ctx.db.get(args.documentId)

        if (!document) {
            return null;
        }

        if (document.tokenIdentifier !== userId) {
            return null;
        }
        return {
            ...document,
            documentUrl: await ctx.storage.getUrl(document.fileId)
        };
    }
})


export const createDocument = mutation({
    args: {
        title: v.string(),
        fileId: v.id("_storage"),
        description: v.string(),
    },
    async handler(ctx, args) {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            throw new ConvexError('no authenicated user')
        }
        await ctx.db.insert('documents', {
            title: args.title,
            tokenIdentifier: userId,
            description: args.description,
            fileId: args.fileId,
        })
    },
})

export const askQuestion = action({
    args: {
        question: v.string(),
        documentId: v.id("documents"),
    },
    async handler(ctx, args) {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            throw new ConvexError('no authenicated user')
        }

        const document = await ctx.runQuery(api.documents.getDocument, {
            documentId: args.documentId,
        });
        if (!document) {
            throw new ConvexError("Document not found");
        }

        const file = await ctx.storage.get(document.fileId);
        if (!file) {
            throw new ConvexError("Document not found");
        }
    },
})

//1 hr 40min 