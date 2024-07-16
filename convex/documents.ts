import { ConvexError, v } from "convex/values"
import { action, internalQuery, mutation, MutationCtx, query, QueryCtx } from "./_generated/server"
import { api } from './_generated/api'
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
})

export const hasOrgAccess = async (
    ctx: MutationCtx | QueryCtx,
    orgId: string
) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
        return false;
    }

    const membership = await ctx.db
        .query("memberships")
        .withIndex("by_orgId_userId", (q) =>
            q.eq("orgId", orgId).eq("userId", userId)
        )
        .first();

    return !!membership;
};

export const getDocuments = query({
    args: {
        orgId: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            return undefined;
        }

        if (args.orgId) {
            const isMember = await hasOrgAccess(ctx, args.orgId);
            if (!isMember) {
                return undefined;
            }

            return await ctx.db
                .query("documents")
                .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
                .collect();
        } else {
            return await ctx.db
                .query("documents")
                .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
                .collect();
        }
    },
});


export const getDocument = query({
    args: {
        documentId: v.id("documents"),
    },
    async handler(ctx, args) {
        const accessObj = await hasAccessToDocument(ctx, args.documentId);

        if (!accessObj) {
            return null;
        }

        return {
            ...accessObj.document,
            documentUrl: await ctx.storage.getUrl(accessObj.document.fileId),
        };
    },
});


export const createDocument = mutation({
    args: {
        title: v.string(),
        fileId: v.id("_storage"),
        description: v.string(),
        orgId: v.optional(v.string())
    },
    async handler(ctx, args) {

        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if (!userId) {
            throw new ConvexError('no authenicated user')
        }

        let documentId: Id<"documents">;

        if (args.orgId) {
            const isMember = await hasOrgAccess(ctx, args.orgId);
            if (!isMember) {
                throw new ConvexError("You don't have access to this Organization")
            }
            documentId = await ctx.db.insert('documents', {
                title: args.title,
                description: args.description,
                fileId: args.fileId,
                orgId: args.orgId,
            });
        } else {
            documentId = await ctx.db.insert("documents", {
                title: args.title,
                tokenIdentifier: userId,
                fileId: args.fileId,
                description: args.description,
            })
        }
    },
})

export async function hasAccessToDocument(
    ctx: MutationCtx | QueryCtx,
    documentId: Id<"documents">
) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
        return null;
    }

    const document = await ctx.db.get(documentId);

    if (!document) {
        return null;
    }

    if (document.orgId) {
        const hasAccess = await hasOrgAccess(ctx, document.orgId);

        if (!hasAccess) {
            return null;
        }
    } else {
        if (document.tokenIdentifier !== userId) {
            return null;
        }
    }

    return { document, userId };
}

export const hasAccessToDocumentQuery = internalQuery({
    args: {
        documentId: v.id("documents"),
    },
    async handler(ctx, args) {
        return await hasAccessToDocument(ctx, args.documentId);
    },
});


export const deleteDocument = mutation({
    args: {
        documentId: v.id("documents"),
    },
    async handler(ctx, args) {
        const accessObj = await hasAccessToDocument(ctx, args.documentId);
        if (!accessObj) {
            throw new ConvexError("You do not have to access to this document");
        }
        await ctx.storage.delete(accessObj.document.fileId);
        await ctx.db.delete(args.documentId);
    }
})

