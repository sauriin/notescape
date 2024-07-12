'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { DeleteDocumentButton } from "./delete-document-button";

export default function DocumentPage({
    params,
}: {
    params: {
        documentId: Id<"documents">;
    };
}) {
    const document = useQuery(api.documents.getDocument, {
        documentId: params.documentId,
    });


    return (
        <main className="p-24 space-y-8">

            {!document &&
                <div className="space-y-8">
                    <div>
                        <Skeleton className="h-[40px] w-[500px]" />
                    </div>
                    <div>
                        <Skeleton className="h-[500px] " />
                    </div>
                </div>
            }

            {document && (
                <>
                    <div className="flex justify-between items-center">
                        <h1 className="text-4xl font-bold">{document.title}</h1>
                        <DeleteDocumentButton documentId={document._id} />
                    </div>
                    <div className="flex gap-12">

                        <div className="bg-gray-900 p-4 rounded-xl flex-1 h-[screen]">
                            {document.documentUrl && <iframe className="h-screen w-full" src={document.documentUrl} />}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
} 