"use client"

import { useQuery } from "convex/react";
import UploadNoteButton from "./upload-note-button";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function NotesLayout({
    children,
}: {
    children: ReactNode,
    notes: ReactNode,
}) {
    const notes = useQuery(api.notes.getNotes);
    const { noteId } = useParams<{ noteId: Id<"notes"> }>();

    return (
        <main className="w-full space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Notes</h1>
                <UploadNoteButton />
            </div>

            <div className="flex gap-12">
                <ul className="space-y-2 w-[200px]">
                    {notes?.map((note) =>
                        <li key={note._id} className={cn("text-base hover:text-blue-100", {
                            "text-blue-300": note._id === noteId,
                        })}>
                            <Link href={`/dashboard/notes/${note._id}`}>{note.text.substring(0, 20) + "..."}</Link>
                        </li>)}
                </ul>
                <div className="bg-slate-900 rounded p-4 w-full">{children}</div>
            </div>
        </main >
    );
}