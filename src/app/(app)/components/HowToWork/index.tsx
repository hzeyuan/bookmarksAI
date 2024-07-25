"use client"
import { cn } from "@lib/utils";
import { BentoCard, BentoGrid } from "@src/components/ui/BentoGrid"
// import Marquee from "@src/components/ui/Marquee";
import { BookmarkIcon, BrainCircuitIcon, FolderTreeIcon, HistoryIcon } from "lucide-react";
import Image from "next/image";
import newFolderPng from '@assets/bento/new-folder.png'
import { AnimatedListDemo } from "./demo/AnimatedListDemo";
import AnimatedBeamMultipleOutputDemo from "./demo/animated-beam-multiple-inputs";
import Marquee from "@src/components/ui/marquee";
const files = [
    {
        name: "bitcoin.pdf",
        body: "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
    },
    {
        name: "finances.xlsx",
        body: "A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.",
    },
    {
        name: "logo.svg",
        body: "Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.",
    },
    {
        name: "keys.gpg",
        body: "GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.",
    },
    {
        name: "seed.txt",
        body: "A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.",
    },
];

const features = [
    {
        Icon: BookmarkIcon,
        name: "Collect Bookmarks",
        description: "Our plugin retrieves your bookmarks and creates a new classification structure.",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-1",
        background: (
            <Image
                alt="bookmark collection"
                width={'100%'}
                height={'100%'}
                className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)] "
                src={newFolderPng} />
        ),
    },
    {
        Icon: BrainCircuitIcon,
        name: "AI Analysis",
        description: "AI analyzes each bookmark individually, categorizing and tagging them.",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-2",
        background: (
            <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
        ),
    },
    {
        Icon: FolderTreeIcon,
        name: "Reorganize",
        description: "New bookmarks are reclassified into categories, completing the organization.",
        href: "#",
        cta: "Learn more",
        className: "col-span-3 lg:col-span-2",
        background: (
            <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
        ),
    },
    {
        Icon: HistoryIcon,
        name: "Future Plans",
        description: "We plan to include browser history and more in future updates.",
        className: "col-span-3 lg:col-span-1",
        href: "#",
        cta: "Learn more",
        background: (
            <Marquee
                pauseOnHover
                className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
            >
                {files.map((f, idx) => (
                    <figure
                        key={idx}
                        className={cn(
                            "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                            "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                            "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                            "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
                        )}
                    >
                        <div className="flex flex-row items-center gap-2">
                            <div className="flex flex-col">
                                <figcaption className="text-sm font-medium dark:text-white ">
                                    {f.name}
                                </figcaption>
                            </div>
                        </div>
                        <blockquote className="mt-2 text-xs">{f.body}</blockquote>
                    </figure>
                ))}
            </Marquee>

        ),
    },
];

export const How2Work = () => {
    return (
        <div id="how-it-work" className="">
            <div
                className="relative z-20 py-10 lg:py-40  mx-auto">
                <div className="px-8">
                    <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                        How it works
                    </h4>

                    <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                        Beyond browser bookmarks: Organize anything from the internet for easy rediscovery
                    </p>
                </div>

                <div className="relative ">
                    <BentoGrid>
                        {features.map((feature, idx) => (
                            <BentoCard key={idx} {...feature} />
                        ))}
                    </BentoGrid>
                </div>
            </div>
        </div>

    )
}