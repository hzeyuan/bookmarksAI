import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval' // can use anything: IndexedDB, Ionic Storage, etc.
import type { IVChart } from '@visactor/react-vchart';




export interface Tag {
    id: string;
    name: string;
    bookmarkId: string;
    category?: string;
}


const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await get(name)) || null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name)
    },
}

interface TagsStore {
    tags: Tag[];
    addTag: (tag: Tag) => void;
    setTags: (tags: Tag[]) => void;
    addTags: (tags: Tag[]) => void;
    deleteTag: (id: string) => void;
    vChartRef: IVChart;
    setVChartRef: (vChartRef: IVChart) => void;
}

export const useTagsStore = create(
    persist<TagsStore>((set, get) => ({
        tags: [],
        vChartRef: null,
        addTag: (tag) => set((state) => {
            const tags = [...state.tags, tag]
            return { tags }
        }),
        addTags: (tags) => set((state) => {
            console.log('addTags tags', tags)
            const newTags = [...new Set([...state.tags, ...tags])]
            return { tags: newTags }
        }),
        setVChartRef: (vChartRef) => set({ vChartRef }),
        setTags: (tags) => set({ tags }),
        deleteTag: (tag: string) => {
            const tags = get().tags.filter((t) => t.id !== tag)
            set({ tags })
        }
    }), {
        name: 'tags',
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
            tags: state.tags
        })
    })
)