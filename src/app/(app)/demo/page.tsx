"use client"

import { GenTagFlow } from "./components/gen-tag-flow";
import { BookmarksContainer } from "../components/bookmarksPanel";
import { useBookmarkStore, type DDBookmarkTreeNode } from "@src/hooks/useBookmarkStore";
import { useTagsStore, type Tag } from "@src/hooks/useTagsStore";
import pLimit from "p-limit";
import { generateTagsRequest, requestGenerateNewFolder, requestTestConnection } from "../request";
import { memo, useEffect, useMemo, useRef } from "react";
import { v4 } from 'uuid';
import Image from "next/image";
import React from "react";
import { sendToBackgroundViaRelay } from "@plasmohq/messaging";
import { deserializeMarkdownToTree, findNodeInTree, transformBookmarks2Array, transformBookmarks2Md, transformBookmarksFlat } from "@src/app/utils";
import * as _ from 'lodash-es';
import { toast } from "sonner"
import { LoadingSpinner } from "@src/components/ui/loading-spinner";
import { Button } from "@src/components/ui/button";
import BoldCopy from "@src/components/ui/bold-copy";
import LazyLoadAnimatedSection from "../components/LazyLoadAnimatedSection";
import { TagList } from "../components/TagList";
import MarkmapPanel, { type MarkmapHooksRef } from "../components/markmap-panel/markmap-panel";
import { useRouter } from "next/navigation";
import { FolderTreemapChart } from "../components/folder-treemap-chart";
import { ApiKeyPanel } from "../../../components/ui/api-key-panel";
import type { Bookmarks } from "webextension-polyfill";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@components/ui/alert-dialog";
import chromeBookmarkScreenShotPng from "@assets/chrome-bookmark-screenshot.png";


const MemoizedBookmarksContainer = memo(BookmarksContainer);
const BookmarksContainerWrapper = () => {
    const bookmarks = useBookmarkStore(state => state.bookmarks);
    const nestedFolder = useBookmarkStore(state => state.folders);
    return <MemoizedBookmarksContainer
        nestedFolder={nestedFolder}
        bookmarkArray={bookmarks}
    />;
};

const MemoTagList = memo(() => {
    const bookmarks = useBookmarkStore(state => state.bookmarks);
    return (<TagList bookmarks={bookmarks} />)
})

const MemoFolderTreemapChart = memo(() => {
    const folder = useBookmarkStore(state => state.folders);
    const md = transformBookmarks2Md(folder).slice(1,).join('\n');
    return (<FolderTreemapChart s={md}></FolderTreemapChart>)
});




const Page = () => {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const syncSetBookmarks = useBookmarkStore(state => state.syncSetBookmarks);
    const upsertBookmark = useBookmarkStore((state) => state.upsertBookmark);
    const addTags = useTagsStore((state) => state.addTags);
    const markmapRef = useRef<MarkmapHooksRef>(null);
    const folders = useBookmarkStore((state) => state.folders);
    const router = useRouter();


    const handleGenerateTags = async (newBookmarks: DDBookmarkTreeNode[], curFolders: string[]) => {
        const userLanguage = navigator.language;
        const limit = pLimit(15);
        const processBookmark = async (bookmark, index) => {
            console.log('开始生成tag:', bookmark);
            let result;
            try {
                result = await generateTagsRequest({
                    bookmark,
                    categories: curFolders,
                    language: userLanguage
                });
            } catch (err) {
                console.error('生成tag失败', err);
                return null;
            }
            const { tags: newTagStringArray, tagCategories, bookmarkCategory } = result;

            const newTags = newTagStringArray.map((name: string) => {
                return {
                    name: name,
                    id: v4(),
                    bookmarkId: bookmark.id,
                    category: tagCategories[name],
                }
            });

            toast.info(`generate tags for ${bookmark.title}`, {
                description: `tags: ${newTagStringArray.join(',')}`,
            })

            const folders = useBookmarkStore.getState().folders;

            const parentId = findNodeInTree(folders, node => node.title === bookmarkCategory.trim())?.id || '';

            console.log('bookmarkCategory', bookmarkCategory, 'parentId', parentId);
            // save tags and bookmark
            upsertBookmark({
                ...bookmark,
                id: bookmark.id,
                tags: newTags,
                isTagged: true,
                taggedTime: new Date().getTime(),
                parentName: bookmarkCategory,
                parentId: parentId,
            });
            // add tag and update tag cloud
            addTags(newTags);

            return { bookmark, newTags, tagCategories, bookmarkCategory };
        };
        const tasks = newBookmarks.slice(10).map((bookmark, index) => {
            return limit(() => processBookmark(bookmark, index))
        });

        await Promise.all(tasks);

    }

    const handleGenerateNewFolder = async ({ folders, bookmarks }) => {
        const userLanguage = navigator.language;
        try {
            setLoading(true);
            const newFolderMd = await requestGenerateNewFolder({
                folders: folders,
                bookmarks: [],
                language: userLanguage
            });
            markmapRef.current?.updateMarkmap(newFolderMd);
            const newFolder = deserializeMarkdownToTree(_.compact(newFolderMd.split('\n')));
            useBookmarkStore.getState().setFolder(newFolder);
            setLoading(false);
            toast.success('generate new bookmark structure', {
                description: 'you can see in the mindmap',
            })
            return newFolder;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleWorkflowStart = async () => {
        console.log('handleWorkflowStart');

        const isInstalled = await Promise.race([
            sendToBackgroundViaRelay({
                name: 'is_installed',
            }),
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(false);
                }, 2000);
            })
        ]);

        console.log('isInstalled', isInstalled);
        if (!isInstalled) {
            window.open('/extension', '_blank');
            toast.error('Please install the chrome extension first');
            return;
        }

        const storedApiKey = localStorage.getItem('apikey');
        const storedApiBaseUrl = localStorage.getItem('apiBaseUrl');

        console.log('storedApiKey', storedApiKey, storedApiBaseUrl);

        const result = await requestTestConnection({
            apiKey: storedApiKey,
            apiBaseUrl: storedApiBaseUrl
        });
        if (!result) {
            toast.error('Please check your api key and base url');
            return;
        }


        // 获取用户书签
        const { bookmarksTree } = await sendToBackgroundViaRelay({
            name: 'bookmarks',
            body: { type: 'getTree' }
        });
        // console.log('bookmarks.forEach', bookmarksTree);
        const fullBookmarksArray = transformBookmarks2Array(bookmarksTree);
        const bookmarkArray = fullBookmarksArray.filter(b => b.url).map(item => _.omit(item, ['children']));
        const curFolders = fullBookmarksArray.filter(b => !b.url).map(b => b.title);

        syncSetBookmarks(bookmarkArray);
        try {
            // // 1.new folders
            const newFolders = await handleGenerateNewFolder({
                folders: curFolders,
                bookmarks: bookmarkArray,
            });

            toast.info(`1.generate new folders`, {
                description: 'Now, we will generate new folders for each bookmark',
            })

            await new Promise((resolve) => {
                setTimeout(() => {
                    const element = document.getElementById('folderTreemapChart');
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                    resolve(true);
                }, 300);
            });

            // 2. generate tags
            const localBookmarks = useBookmarkStore.getState().bookmarks || [];
            // console.log('localBookmarks', localBookmarks);
            const newBookmarks = bookmarkArray.filter(b => b.url);
            const pendingProcessedBookmarks = newBookmarks.map(b1 => {
                const findBookmarkInLocal = localBookmarks.find(b2 => b2.url === b1.url);
                if (findBookmarkInLocal?.isTagged) {
                    return null;
                }
                return b1;
            });

            await new Promise((resolve) => {
                setTimeout(() => {
                    const element = document.getElementById('bookmark-classification-tagging-processing-factory');
                    if (element) {
                        const offset = 40;
                        const elementRect = element.getBoundingClientRect();
                        const elementTop = elementRect.top + window.pageYOffset;
                        window.scrollTo({
                            top: elementTop - offset, // 在元素的顶部位置基础上减去偏移量
                            behavior: 'smooth'
                        });
                    }
                    resolve(true);
                }, 300);
            });

            toast.info(`2.generate tags`, {
                description: 'Now, we will generate tags for each bookmark',
            })

            const newFoldersStringArray = transformBookmarksFlat(newFolders, (b) => b.title);
            await handleGenerateTags(pendingProcessedBookmarks, newFoldersStringArray);

            setOpen(true);

        } catch (error) {
            console.error('handleWorkflowStart', error);
        }
    };

    const initWorkflow = () => {
        useBookmarkStore.getState().setBookmarks([]);
        useBookmarkStore.getState().setFolder([]);
        toast.success('Clear Local Record', {
            description: 'You can restart build bookmarks',
        });
    }

    function assignBookmarksToFolders(nestedFolders: DDBookmarkTreeNode[], bookmarks: DDBookmarkTreeNode[]): DDBookmarkTreeNode[] {
        const folderMap = new Map<string, DDBookmarkTreeNode>();
        function mapFolders(folder: DDBookmarkTreeNode) {
            folderMap.set(folder.id, folder);
            folder.children.forEach(child => {
                if ('children' in child) {
                    mapFolders(child as DDBookmarkTreeNode);
                }
            });
        }

        // 填充 folderMap
        nestedFolders.forEach(mapFolders);

        // 分配书签到对应的文件夹
        bookmarks.forEach(bookmark => {
            const parentFolder = folderMap.get(bookmark.parentId);
            if (parentFolder) {
                // 如果找到父文件夹，将书签添加到其 children 数组中
                const chromeBookmark: Bookmarks.BookmarkTreeNode = {
                    title: bookmark.title,
                    url: bookmark.url,
                    id: bookmark.id,
                    parentId: bookmark.parentId,
                    dateAdded: bookmark.dateAdded,
                    dateGroupModified: bookmark.dateGroupModified,
                    index: bookmark.index,
                }
                parentFolder.children.push(chromeBookmark);
                // 根据 index 排序 children 数组
                parentFolder.children.sort((a, b) => (a.index || 0) - (b.index || 0));
            } else {
                console.warn(`Parent folder with id ${bookmark.parentId} not found for bookmark: ${bookmark.title}`);
            }
        });
        return nestedFolders;
    }

    const handleRebuildBookmarks = async () => {
        const bookmarks = useBookmarkStore.getState().bookmarks;
        const nestedFolders = useBookmarkStore.getState().folders;
        if (bookmarks.length == 0 || nestedFolders.length === 0) {
            toast.error('Please generate new folders and tags first');
            return;
        }
        const reBuildBookmarks = assignBookmarksToFolders(nestedFolders, bookmarks);
        console.log('reBuildBookmarks', reBuildBookmarks);
        const isSuccess = await sendToBackgroundViaRelay({
            name: 'bookmarks',
            body: {
                type: 'set',
                bookmarks: reBuildBookmarks
            }
        });
        if (isSuccess) {
            toast.success('Sync to Chrome Bookmarks', {
                description: 'You can see in your chrome bookmarks',
            });
        } else {
            toast.error('Sync to Chrome Bookmarks failed', {
                description: 'Please check your chrome bookmarks',
            });
        }
        setOpen(false);
    }

    useEffect(() => {
        const md = transformBookmarks2Md(folders).join('\n') || '#  Make your bookmarks living';
        markmapRef.current?.updateMarkmap(md);
    }, [folders]);


    return (
        <div className=" container">
            <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>rebuild  bookmarks </AlertDialogTitle>
                        <AlertDialogDescription>
                            If you Press the confirm, new rebuild bookmarks will be sync to Chrome Bookmarks,
                            it not reversible, please make sure you have a backup.
                            when sync done, you can see in your chrome bookmarks

                            <Image className="py-4" src={chromeBookmarkScreenShotPng} alt={""}></Image>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setOpen(false);
                        }}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRebuildBookmarks} >Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <LoadingSpinner
                text={'Please wait...'}
                className="mr-2 h-4 w-4 animate-spin"
                isLoading={loading}>
            </LoadingSpinner>
            <div className="flex justify-center flex-col items-center py-12 gap-x-4">
                <h3 className=" flex items-center  py-5 justify-center  gap-x-2 text-4xl md:text-6xl tracking-tighter font-extrabold text-neutral-900">
                    AI Bookmarks Demo
                </h3>
                <div className="flex gap-x-2">
                    <Button onClick={() => { handleWorkflowStart() }}>Start Rebuild</Button>
                    <Button className="bg-[mediumpurple]"
                        onClick={() => setOpen(true)}>Async to Chrome Bookmarks</Button>
                    <Button variant="destructive" onClick={() => { initWorkflow() }}>Clear Local Record</Button>
                </div>
                <p className="mt-8 text-lg text-slate-600 text-center">
                    AI automatically organizes and categorizes your browser bookmarks
                </p>
                <ul className="py-2 ">
                    <li>1. Setting your OpenAI key</li>
                    <li>2. Click Button to start</li>
                    <li>3. Show time And Enjoy!!</li>
                </ul>
            </div>

            <ApiKeyPanel></ApiKeyPanel>

            <BoldCopy
                className="border border-gray-200 dark:border-zinc-800"
                text={'Generate New Folder'}
            ></BoldCopy>

            <div className="p-0 py-8 h-[60vh]">
                <MarkmapPanel ref={markmapRef} />
            </div>
            <div id="folderTreemapChart" className="py-8">
                <MemoFolderTreemapChart></MemoFolderTreemapChart>
            </div>
            <BoldCopy
                text={'Tag each bookmark with multiple labels for classification.'}
                className="border border-gray-200 dark:border-zinc-800"
            ></BoldCopy>
            <div id="bookmark-classification-tagging-processing-factory">
                <LazyLoadAnimatedSection animation="scaleIn">
                    <GenTagFlow ></GenTagFlow>
                </LazyLoadAnimatedSection>
            </div>

            <div className=" py-12">
                {/* <BoldCopy text={'OverView'}
                    className="border border-gray-200 dark:border-zinc-800 py-12"
                ></BoldCopy> */}
                <LazyLoadAnimatedSection animation="scaleIn">
                    <BookmarksContainerWrapper></BookmarksContainerWrapper>
                </LazyLoadAnimatedSection>
            </div>

            <LazyLoadAnimatedSection animation="scaleIn">
                <MemoTagList />
            </LazyLoadAnimatedSection>
        </div>
    );
}

export default Page;



