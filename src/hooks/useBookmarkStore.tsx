import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval' // can use anything: IndexedDB, Ionic Storage, etc.
import type { Bookmarks } from 'webextension-polyfill'
import { extractDomainsFromBookmarks } from '@src/app/utils/aggregation'
import type { Tag } from './useTagsStore'

// Custom storage object
const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        console.log(name, 'has been retrieved')
        return (await get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        // console.log(name, 'with value', value, 'has been saved')
        await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
        // console.log(name, 'has been deleted')
        await del(name)
    },
}

export interface DDBookmarkTreeNode extends Bookmarks.BookmarkTreeNode {
    tags?: Tag[];
    isTagged?: boolean;
    taggedTime?: number;
    parentName?: string;
}


interface BookmarkStore {
    folders: Bookmarks.BookmarkTreeNode[];
    bookmarks: DDBookmarkTreeNode[];
    setBookmarks: (bookmarks: DDBookmarkTreeNode[]) => void;
    setFolder: (folders: Bookmarks.BookmarkTreeNode[]) => void;
    syncSetBookmarks: (bookmarks: DDBookmarkTreeNode[]) => void;
    addBookmark: (bookmark: DDBookmarkTreeNode) => void;
    removeBookmark: (id: string) => void;
    updateBookmark: (id: string, updates: Partial<DDBookmarkTreeNode>) => void;
    upsertBookmark: (bookmark: DDBookmarkTreeNode | Partial<DDBookmarkTreeNode>) => void;
    moveBookmark: (id: string, newParentId: string, index?: number) => void;
    // 获取文件夹
    getFolders: () => DDBookmarkTreeNode[];
    // 获取书签
    getBookmarks: () => DDBookmarkTreeNode[];
    getDomainsFromBookmarks: () => string[];
}

export const useBookmarkStore = create(
    persist<BookmarkStore>(
        (set, get) => ({
            folders: [],
            bookmarks: [],
            setFolder: (folders) => set({ folders }),
            getFolders: () => {
                return get().bookmarks.filter(b => !b.url);
            },

            getBookmarks: () => {
                return get().bookmarks.filter(b => b.type === 'bookmark');
            },
            setBookmarks: (bookmarks) => set({ bookmarks }),

            syncSetBookmarks: async (bookmarks) => {
                const oldBookmarks = get().bookmarks;
                const newBookmarks = bookmarks.map(b => {
                    const isFolder = b.url === undefined;
                    if (isFolder) {
                        const oldBookmark = oldBookmarks.find(ob => ob.title === b.title);
                        if (oldBookmark) {
                            return oldBookmark;
                        } else {
                            return {
                                ...b,
                                isTagged: false,
                                tags: []
                            }
                        }
                    } else {
                        const oldBookmark = oldBookmarks.find(ob => ob.url === b.url);
                        if (oldBookmark) {
                            return oldBookmark;
                        } else {
                            return {
                                ...b,
                                isTagged: false,
                                tags: []
                            }
                        }
                    }
                });
                set({ bookmarks: newBookmarks });
            },
            addBookmark: (bookmark) => set((state) => ({
                bookmarks: [...state.bookmarks, bookmark]
            })),
            upsertBookmark: (bookmark) => set((state) => {

                const bookmarkIndex = state.bookmarks.findIndex(b => b.id === bookmark.id);
                if (bookmarkIndex === -1) {
                    return {
                        bookmarks: [...state.bookmarks, bookmark as DDBookmarkTreeNode]
                    }
                } else {
                    const updatedBookmarks = [...state.bookmarks];
                    updatedBookmarks[bookmarkIndex] = {
                        ...updatedBookmarks[bookmarkIndex],
                        ...bookmark,
                    }
                    return { bookmarks: updatedBookmarks };
                }
            }),
            removeBookmark: (id) => set((state) => ({
                bookmarks: state.bookmarks.filter(b => b.id !== id)
            })),
            updateBookmark: (id, updates) => set((state) => ({
                bookmarks: state.bookmarks.map(b =>
                    b.id === id ? { ...b, ...updates } : b
                )
            })),
            moveBookmark: (id, newParentId, index) => set((state) => {
                const bookmarkIndex = state.bookmarks.findIndex(b => b.id === id);
                if (bookmarkIndex === -1) return state;

                const updatedBookmarks = [...state.bookmarks];
                const [movedBookmark] = updatedBookmarks.splice(bookmarkIndex, 1);
                movedBookmark.parentId = newParentId;
                if (index !== undefined) {
                    movedBookmark.index = index;
                }
                updatedBookmarks.push(movedBookmark);

                return { bookmarks: updatedBookmarks };
            }),

            getDomainsFromBookmarks: () => {
                return extractDomainsFromBookmarks(get().bookmarks);
            }
        }),
        {
            name: 'bookmark-storage',
            storage: createJSONStorage(() => storage),
        }
    )
)