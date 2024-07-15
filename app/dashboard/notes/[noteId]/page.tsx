"use client"

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { DeleteNoteButton } from "./note-delete-button";

export default function NotePage() {
    const { noteId } = useParams<{ noteId: Id<"notes"> }>();
    const note = useQuery(api.notes.getNote, {
        noteId: noteId,
    });

    if (!note) {
        return null
    }
    return (
        <div className="relative ">
            <DeleteNoteButton noteId={note?._id} />
            <div className="pr-3">
                {note?.text}
            </div>
        </div>
    );
}