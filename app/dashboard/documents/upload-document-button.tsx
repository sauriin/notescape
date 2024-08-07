"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Upload } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import UploadForm from "./upload-form";

export default function UploadDocumentButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>
                <Button className={btnStyles}>
                    <Upload className={btnIconStyles} /> Upload Document
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload a Document</DialogTitle>
                    <DialogDescription>
                        Upload a team document for you to search over in the future.
                    </DialogDescription>

                    <UploadForm onUpload={() => setIsOpen(false)} />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}