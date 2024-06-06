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


export default function AddDocumentButton() {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>
                < Button>Upload Document</Button >
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
