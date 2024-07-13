'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { mutation } from "@/convex/_generated/server"
import { Id } from "@/convex/_generated/dataModel"
import { LoadingButton } from "@/components/loading-button"


const formSchema = z.object({
    title: z.string().min(1).max(25),
    file: z.custom<File>((val) => val instanceof File, "Required"),
    description: z.string().min(1).max(250),
})


export default function UploadForm({
    onUpload,
}: {
    onUpload: () => void
}) {
    const createDocument = useMutation(api.documents.createDocument)
    const generateUploadUrl = useMutation(api.documents.generateUploadUrl)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        const url = await generateUploadUrl();
        console.log(url)

        const result = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": values.file.type },
            body: values.file,
        })

        const { storageId } = await result.json();

        await createDocument({
            title: values.title,
            description: values.description,
            fileId: storageId as Id<"_storage">,
        })
        onUpload();
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Expense Report" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="It is an expense Report" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                            <FormLabel>File</FormLabel>
                            <FormControl>
                                <Input
                                    accept=".txt,.pdf,.doc,.csv"
                                    {...fieldProps}
                                    type="file"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        onChange(file)
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />



                <LoadingButton isLoading={form.formState.isSubmitting}
                    loadingText="Uploading...">
                    Upload
                </LoadingButton>
            </form>
        </Form>
    )
}
