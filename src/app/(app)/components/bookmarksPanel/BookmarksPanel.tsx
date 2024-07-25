import { transformBookmarks2Array } from "@src/app/utils";
import { useBookmarkNavStore } from "@src/hooks/useBookmarkNavStore";
import { useBookmarkStore } from "@src/hooks/useBookmarkStore";
import * as _ from 'lodash-es';
import { useMemo } from "react";

export const BookmarksPanel = ({ bookmarkArray, nestedFolder }) => {
    const curSelectedBookmarkId = useBookmarkNavStore(state => state.curSelectedBookmarkId) || 'Bookmarks Bar'


    const foldersAndBookmarks = useMemo(() => {
        const bookmarks = (bookmarkArray || []).filter(b => curSelectedBookmarkId === b.parentId);

        const folders = transformBookmarks2Array(nestedFolder)
        const parentFolder = folders.find(b => curSelectedBookmarkId === b.id);

        return {
            folders: parentFolder?.children || [],
            bookmarks: bookmarks
        }

    }, [curSelectedBookmarkId])


    const path = useMemo(() => {
        const folders = useBookmarkStore.getState().folders;

        const findPath = (folders, targetId, currentPath = []) => {
            for (const folder of folders) {
                if (folder.id === targetId) {
                    return [...currentPath, folder.title];
                }
                if (folder.children) {
                    const result = findPath(folder.children, targetId, [...currentPath, folder.title]);
                    if (result) return result;
                }
            }
            return null;
        };
        const result = findPath(folders, curSelectedBookmarkId);
        return result ? result.join(' > ') : '';
    }, [curSelectedBookmarkId]);


    return (
        <div className="dark:bg-gray-900 flex flex-col">
            <main className="mt-4 dark:pintree-bg-gray-900 flex-grow">
                <div
                    id="loading-spinner"
                    className="flex justify-center items-center h-full"
                    style={{ display: "none" }}
                >
                    <div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-400 h-6 w-6" />
                </div>
                <div
                    className="mt-2 px-6 text-sm text-gray-400 flex justify-between items-center"
                >
                    <div id="breadcrumbs-path" className="">
                        <span className="cursor-pointer hover:underline">
                            {path}
                        </span>
                    </div>
                </div>
                <div id="bookmarks" className="grid gap-6 p-6 overflow-y-scroll "
                    style={{
                        maxHeight: "calc(100vh - 24px)",
                    }}
                >
                    {foldersAndBookmarks?.folders?.length > 0 && (<>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-6">
                            {
                                foldersAndBookmarks?.folders.map(folder => {
                                    return (
                                        <div className="folder-card text-gray rounded-lg cursor-pointer flex flex-col items-center">
                                            <div className="mb-2">
                                                <svg viewBox="0 0 100 80" className="folder__svg">
                                                    <rect
                                                        x={0}
                                                        y={0}
                                                        width={100}
                                                        height={80}
                                                        className="folder__back"
                                                    />
                                                    <rect
                                                        x={15}
                                                        y={8}
                                                        width={70}
                                                        height={60}
                                                        className="paper-1"
                                                    />
                                                    <rect
                                                        x={10}
                                                        y={18}
                                                        width={80}
                                                        height={50}
                                                        className="paper-2"
                                                    />
                                                    <rect
                                                        x={0}
                                                        y={10}
                                                        width={100}
                                                        height={70}
                                                        className="folder__front"
                                                    />
                                                    <rect
                                                        x={0}
                                                        y={10}
                                                        width={100}
                                                        height={70}
                                                        className="folder__front right"
                                                    />
                                                </svg>
                                            </div>
                                            <h2 className="text-xs font-normal text-center w-full truncate dark:text-gray-400">
                                                {folder.title}
                                            </h2>
                                        </div>)
                                })
                            }

                        </div>
                        <hr className="my-1 border-t-1 border-gray-200 dark:pintree-border-gray-800" />
                    </>)}

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-6">
                        {foldersAndBookmarks?.bookmarks.map(bookmark => {
                            return (
                                <a
                                    href={bookmark.url}
                                    key={bookmark.id}
                                    target="_blank"
                                    className="cursor-pointer flex h-fit items-center hover:shadow-sm transition-shadow p-4 bg-white shadow-sm ring-1 ring-gray-900/5 dark:pintree-ring-gray-800 rounded-lg hover:bg-gray-100 dark:pintree-bg-gray-900 dark:hover:pintree-bg-gray-800">
                                    <img
                                        src={`https://api.iowen.cn/favicon/${bookmark.url?.replace(/^https?:\/\//, '').split('/')[0]}.png`}
                                        alt="Hey, I'm Chi."
                                        className="w-8 h-8 mr-4 rounded-full flex-shrink-0 card-icon-bg"
                                    />
                                    <div className="flex flex-col overflow-hidden">
                                        <h2 className="text-sm font-semibold mb-1 truncate dark:text-gray-400">
                                            {/* {bookmark.parentId} - */}
                                            {bookmark.title}
                                        </h2>
                                        <p className="text-xs text-gray-400 truncate">
                                            {bookmark.url}
                                        </p>
                                    </div>
                                </a>
                            )
                        })}

                    </div>
                </div>
            </main>
            {/* Footer */}
            <footer className="bg-white w-full dark:pintree-bg-gray-900">

            </footer>
        </div>
    )
}