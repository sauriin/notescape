import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Doc } from "@/convex/_generated/dataModel"
import { Eye, Upload } from "lucide-react"
import Link from "next/link"

export function DocumentCard({ document }: { document: Doc<'documents'> }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{document.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{document.description}</p>
            </CardContent>
            <CardFooter>
                <Button asChild variant="secondary" className="flex items-center gap-2">
                    <Link href={`/documents/${document._id}`}>
                        <Eye className="w-4 h-4" /> View
                    </Link>
                </Button>
            </CardFooter>
        </Card >
    )
}