"use client"

import { useQuery } from "convex/react";
import UploadNoteButton from "./upload-note-button";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

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

            {!notes && (
                <div className="flex gap-12">
                    <div className="w-[200px] space-y-4">
                        <Skeleton className="h-[20px] w-full" />
                        <Skeleton className="h-[20px] w-full" />
                        <Skeleton className="h-[20px] w-full" />
                        <Skeleton className="h-[20px] w-full" />
                        <Skeleton className="h-[20px] w-full" />
                        <Skeleton className="h-[20px] w-full" />
                    </div>

                    <div className="flex-1">
                        <Skeleton className="h-[400px] w-full" />
                    </div>
                </div>
            )}

            {notes?.length === 0 &&
                <div>
                    <div className="py-12 flex justify-center flex-col items-center gap-8">
                        <Image
                            src="/upload.svg"
                            height="450"
                            width="450"
                            alt="Upload Document Img" />
                        <h2 className="text-2xl">You have no notes</h2>
                    </div>
                </div>
            }

            {notes && notes?.length > 0 && (
                <div className="flex gap-12">
                    <ul className="space-y-2 w-[200px]"
                    >
                        {notes?.map((note) =>
                            <li key={note._id} className={cn("text-base hover:text-blue-100", {
                                "text-blue-300": note._id === noteId,
                            })}>
                                <Link
                                    href={`/dashboard/notes/${note._id}`}
                                >
                                    {note.text.substring(0, 20) + "..."}
                                </Link>
                            </li>)}
                    </ul>
                    <div className="bg-slate-900 rounded p-4 w-full">
                        {children}
                    </div>
                </div>
            )}
        </main >
    );
}
