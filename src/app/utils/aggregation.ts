import type { Bookmarks } from "webextension-polyfill";

// 提取书签数组中的所有url，返回一个数组，然后转换为domain,在去重，最后返回一个数组
export function extractDomainsFromBookmarks(bookmarks: Bookmarks.BookmarkTreeNode[]): string[] {
    const urls = bookmarks.map(b => b.url).filter(Boolean);
    const domains = urls.map(url => new URL(url).hostname);
    return Array.from(new Set(domains));
}