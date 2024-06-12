'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UploadForm from "./upload-form";
import { useState } from "react";
import { Upload } from "lucide-react";


export default function UploadDocumentButton() {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>
                < Button className="flex items-center gap-2">
                    <Upload className="W-4 h-4" />
                    Upload Document
                </Button >
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a Document</DialogTitle>
                    <DialogDescription>
                        Upload a team document for you to search over in a future.
                    </DialogDescription>
                    <UploadForm onUpload={() => setIsOpen(false)} />
                </DialogHeader >
            </DialogContent>
        </Dialog>
    );
}
