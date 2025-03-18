
"use client";

import Image from "next/image";
import { HeaderActions } from "./header-actions";
import Link from "next/link";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { Authenticated } from "convex/react";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
    return (
        <div className="z-10 relative dark:bg-slate-900 bg-slate-100 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex gap-8 items-center">
                    <Link href="/" className="flex items-center gap-4 text-2xl">
                        <Image
                            src="/remove-bg-bulb.png"
                            width={40}
                            height={40}
                            className="rounded"
                            alt="an image of a brain"
                        />
                        NoteScape
                    </Link>

                    <nav className="flex items-center gap-8">
                        <OrganizationSwitcher />
                        <Authenticated>
                            <Link href="/dashboard" className="hover:text-cyan-500">
                                Dashboard
                            </Link>
                        </Authenticated>
                    </nav>
                </div>

                <div className="flex gap-4 items-center">
                    <ModeToggle />
                    <HeaderActions />
                </div>
            </div>
        </div>
    );
}
