'use client'

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { DocumentCard } from "./document-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useOrganization } from "@clerk/nextjs";
import UploadDocumentButton from "./upload-document-button";

export default function Home() {
  const organization = useOrganization();

  const documents = useQuery(api.documents.getDocuments, {
    orgId: organization.organization?.id,
  })

  return (
    <main className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Documents</h1>
        <UploadDocumentButton />
      </div>

      {!documents && (
        <div className="grid grid-cols-3 gap-8">
          {new Array(8).fill("").map((_, i) => (
            <Card className="h-[200px] p-6 flex flex-col space-y-4">
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[20px] rounded" />
              <Skeleton className="h-[40px] w-[80px] rounded" />
            </Card>
          ))}
        </div>
      )}


      {documents && documents.length === 0 && (
        <div className="py-12 flex justify-center flex-col items-center gap-8">
          <Image
            src="/upload.svg"
            height="450"
            width="450"
            alt="Upload Document Img" />
          <h2 className="text-2xl">You have no documents</h2>
          <UploadDocumentButton />
        </div>
      )}

      {documents && documents.length > 0 && (
        <div className="grid grid-cols-4 gap-8">
          {documents?.map((doc) => <DocumentCard document={doc} />)}
        </div>
      )}
    </main>
  );
} 