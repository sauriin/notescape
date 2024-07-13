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
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import CreateNote from "./create-note";
import { useToast } from "@/components/ui/use-toast";


export default function UploadNoteButton() {

    const [isOpen, setIsOpen] = useState(false)
    const { toast } = useToast();

    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>
                < Button className={btnStyles}>
                    <PlusIcon className={btnIconStyles} />
                    Create Note
                </Button >
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a Note</DialogTitle>
                    <DialogDescription>
                        Upload a team document for you to search over in a future.
                    </DialogDescription>
                    <CreateNote onNoteCreated={() => {
                        setIsOpen(false)


                        toast({
                            title: "Note Created",
                            description: "Your note has been created successfully",
                        });
                    }} />
                </DialogHeader >
            </DialogContent>
        </Dialog>
    );
}
