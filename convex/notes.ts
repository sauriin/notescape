import { ConvexError, v } from "convex/values";
import {
    mutation,
    MutationCtx,
    query,
    QueryCtx,
} from "./_generated/server";

import { hasOrgAccess } from "./documents";
import { Doc, Id } from "./_generated/dataModel";


export const getNote = query({
    args: {
        noteId: v.id("notes"),
    },
    async handler(ctx, args) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            return null;
        }

        const note = await ctx.db.get(args.noteId);

        if (!note) {
            return null;
        }

        if (note.orgId) {
            const hasAccess = await hasOrgAccess(ctx, note.orgId);

            if (!hasAccess) {
                return null;
            }
        } else {
            if (note.tokenIdentifier !== userId) {
                return null;
            }
        }

        return note;
    },
});

export const getNotes = query({
    args: {
        orgId: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            return null;
        }

        if (args.orgId) {
            const hasAccess = await hasOrgAccess(ctx, args.orgId);

            if (!hasAccess) {
                return null;
            }

            const notes = await ctx.db
                .query("notes")
                .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
                .collect();

            return notes;
        } else {
            const notes = await ctx.db
                .query("notes")
                .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
                .order("desc")
                .collect();

            return notes;
        }
    },
});

export const createNote = mutation({
    args: {
        text: v.string(),
        orgId: v.optional(v.string()),
    },
    async handler(ctx, args) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            throw new ConvexError("You must be logged in to create a note");
        }

        let noteId: Id<"notes">;

        if (args.orgId) {
            const hasAccess = await hasOrgAccess(ctx, args.orgId);

            if (!hasAccess) {
                throw new ConvexError(
                    "You do not have permission to create a note in this organization"
                );
            }

            noteId = await ctx.db.insert("notes", {
                text: args.text,
                orgId: args.orgId,
            });
        } else {
            noteId = await ctx.db.insert("notes", {
                text: args.text,
                tokenIdentifier: userId,
            });
        }
    },
});

export const deleteNote = mutation({
    args: {
        noteId: v.id("notes"),
    },
    async handler(ctx, args) {
        const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

        if (!userId) {
            throw new ConvexError("You must be logged in to create a note");
        }

        const note = await ctx.db.get(args.noteId);

        if (!note) {
            throw new ConvexError("Note not found");
        }
        await assertActionToNote(ctx,note);

        await ctx.db.delete(args.noteId);
    },
});


async function assertActionToNote(
    ctx: QueryCtx | MutationCtx,
    note: Doc<"notes">
) {

    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
        throw new ConvexError("you must be logged in to create a note.")
    }
    if (note.orgId) {
        const hasAccess = await hasOrgAccess(ctx, note.orgId);

        if (note.orgId) {
            const hasAccess = await hasOrgAccess(ctx, note.orgId);
        }
        if (!hasAccess) {
            throw new ConvexError("You do not have permission to delete this note.");
        }
    } else {
        if (note.tokenIdentifier !== userId) {
            throw new ConvexError("You do not have permission to delete this note.");
        }
    }
}