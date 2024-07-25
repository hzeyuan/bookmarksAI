import { arrayToTree, transformBookmarksStructured } from '@src/app/utils';
import React, { useMemo, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import * as _ from 'lodash-es';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { type DDBookmarkTreeNode } from '@src/hooks/useBookmarkStore';
import { FolderTreemapChart } from './folder-treemap-chart';


const BookmarksIconCloud = dynamic(() => import('./IconCloud').then(mod => mod.BookmarksIconCloud), { ssr: false, });

export const FolderTreeMapSquare: React.FC<{
    bookmarks: DDBookmarkTreeNode[];
    folderMarkdown: string;
}> = ({ folderMarkdown, bookmarks }) => {

    const folderCount = useMemo(() => {
        return bookmarks.filter(bookmark => !bookmark.url).length;
    }, [bookmarks]);

    const processedData = useMemo(() => {

        if (!folderMarkdown) return [];

        const filteredCategory = folderMarkdown.split('\n').filter(item => item.startsWith('#'));
        const folderTree = arrayToTree(filteredCategory);
        return transformBookmarksStructured(folderTree.children, (bookmark, level) => {
            const node = bookmark.children ? {
                name: bookmark.title,
                children: bookmark.children
            } : {
                name: bookmark.title,
            }
            return {
                ...node,
                value: 1,
            };
        })
    }, [folderMarkdown]);


    const bookmarksCount = useMemo(() => {
        return bookmarks.filter(bookmark => bookmark.url).length;
    }, [bookmarks])

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Folder</CardTitle>
                    <CardDescription>
                        Show the folder structure of bookmarks
                    </CardDescription>
                </div>
                <div className="flex">
                    {["Bookmarks", "Folder"].map((key) => {
                        const chart = key;
                        return (
                            <button
                                key={chart}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                            >
                                <span className="text-xs text-muted-foreground">
                                    {chart}
                                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                                    {chart === "Bookmarks" ? bookmarksCount : folderCount}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6 w-full">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-grow lg:w-2/3">
                        <FolderTreemapChart s={folderMarkdown} />

                    </div>
                    <div className="lg:w-1/3">
                        <BookmarksIconCloud bookmarks={bookmarks} />
                    </div>
                </div>
            </CardContent>
        </Card>

    );
};