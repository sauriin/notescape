import Link from "next/link";

export function Footer() {
    return (
        <div className="h-40 bg-gray-100 dark:bg-slate-900 mt-12 flex items-center">
            <div className="container mx-auto flex justify-between items-center">
                <div>NoteScape</div>

                <Link className="text-blue-900 dark:text-gray-100 hover:text-blue-500" href="/privacy">
                    Privacy Policy
                </Link>
                <Link
                    className="text-blue-900 dark:text-gray-100 hover:text-blue-500"
                    href="/terms-of-service"
                >
                    Terms of Service
                </Link>
                <Link className="text-blue-900 dark:text-gray-100 hover:text-blue-500" href="/about">
                    About
                </Link>
            </div>
        </div>
    );
}
