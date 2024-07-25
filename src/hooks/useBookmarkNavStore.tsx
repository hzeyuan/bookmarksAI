import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval' // can use anything: IndexedDB, Ionic Storage, etc.
import type { Bookmarks } from 'webextension-polyfill'


// 定义 store 的状态和操作
interface BookmarkNavStore {
    curSelectedBookmarkId: string;
    setCurSelectedBookmarkId: (curSelectedBookmarkId: string) => void;
}

export const useBookmarkNavStore = create<BookmarkNavStore>(
    (set, get) => ({
        curSelectedBookmarkId: '',
        setCurSelectedBookmarkId: (curSelectedBookmarkId: string) => set({ curSelectedBookmarkId }),
    }),

)