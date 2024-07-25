import BoldCopy from "@src/components/ui/bold-copy"
import LazyLoadAnimatedSection from "../LazyLoadAnimatedSection"
import { FolderTreeMapSquare } from "../FolderTreeMapSquare"
import { BookmarksContainer } from "../bookmarksPanel"
import { MockWorkflow } from "../workflow"
import { TagList } from "../TagList"
import dynamic from "next/dynamic"
import { BOOKMARKS, FOLDER_MARKDOWN } from "../../mock"
import { convertToNestedStructure, transformBookmarks2Array } from "@src/app/utils"
import React from "react"
import { sendToBackgroundViaRelay } from "@plasmohq/messaging"
import taggedBookmarks from '@src/app/(app)/mock/taggedBookmarks.json'
import type { DDBookmarkTreeNode } from "@src/hooks/useBookmarkStore"

const MarkmapPanel = dynamic(() => import("@src/app/(app)/components/markmap-panel/markmap-panel"), { ssr: false, });

export const MockDemo = () => {

    const bookmarks = transformBookmarks2Array(BOOKMARKS);

    const nestedFolder = convertToNestedStructure(bookmarks.filter(b => !b.url));

    return (
        <div id="overview" className="pb-16 gap-y-16  flex flex-col ">
            <LazyLoadAnimatedSection animation="scaleIn">
                <div className="relative z-20 pb-16">
                    <BoldCopy text="Overview" className="border border-gray-200 dark:border-zinc-800" />
                </div>
                <FolderTreeMapSquare bookmarks={bookmarks} folderMarkdown={FOLDER_MARKDOWN} isMock={true} />
            </LazyLoadAnimatedSection>

            <LazyLoadAnimatedSection animation="scaleIn">
                <div className="">
                    <BoldCopy text="MindMap" className="border border-gray-200 dark:border-zinc-800" />
                </div>
                <div className="p-0 py-8 h-[60vh]">
                    <MarkmapPanel md={FOLDER_MARKDOWN} />
                </div>
            </LazyLoadAnimatedSection>

            <div id="demo"></div>
            <LazyLoadAnimatedSection>
                <MockWorkflow bookmarks={bookmarks} className="my-6" />
            </LazyLoadAnimatedSection>

            <LazyLoadAnimatedSection animation="slideIn">
                <BookmarksContainer
                    nestedFolder={nestedFolder}
                    bookmarkArray={bookmarks.filter(b => b.url)}
                />
            </LazyLoadAnimatedSection>

            <LazyLoadAnimatedSection animation="scaleIn">
                <TagList bookmarks={taggedBookmarks as unknown as DDBookmarkTreeNode[]} />
            </LazyLoadAnimatedSection>
        </div>
    )
}