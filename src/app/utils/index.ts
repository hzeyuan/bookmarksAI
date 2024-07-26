import type { DDBookmarkTreeNode } from '@src/hooks/useBookmarkStore';
import * as _ from 'lodash-es';
import { v4 } from 'uuid';
import type { Bookmarks } from 'webextension-polyfill';


export function arrayToTree(bookmarkArray: string[]): DDBookmarkTreeNode {
    let index = 0;
    const root: DDBookmarkTreeNode = { title: "Bookmarks Bar", children: [], id: '0' };
    const stack: DDBookmarkTreeNode[] = [root];
    let currentLevel = 0;

    bookmarkArray.map(item => {
        const level = (item.match(/#/g) || []).length;
        const title = item.replace(/#/g, '').trim();

        while (level <= currentLevel && stack.length > 1) {
            stack.pop();
            currentLevel--;
        }

        const currentIndex = stack[stack.length - 1].children.length
        const node: DDBookmarkTreeNode = {
            title,
            children: [],
            index: currentIndex,
            id: index.toString()
        };
        stack[stack.length - 1].children.push(node);
        stack.push(node);
        index++;
        currentLevel = level;
    });

    return root;
}


export function convertToNestedStructure(flatArray) {
    const idMap = new Map();
    const root = { children: [] };

    // First pass: create all nodes
    flatArray.forEach(item => {
        const node = { ...item, children: [] };
        idMap.set(item.id, node);
    });

    // Second pass: build the tree structure
    flatArray.forEach(item => {
        const node = idMap.get(item.id);
        if (item.parentId) {
            const parent = idMap.get(item.parentId);
            if (parent) {
                parent.children.push(node);
            } else {
                root.children.push(node);
            }
        } else {
            root.children.push(node);
        }
    });

    const sortChildren = (node) => {
        if (node.children && node.children.length > 0) {
            node.children.sort((a, b) => {
                // Handle cases where index might be undefined
                const indexA = typeof a.index === 'number' ? a.index : Infinity;
                const indexB = typeof b.index === 'number' ? b.index : Infinity;
                return indexA - indexB;
            });
            // Use for...of loop instead of forEach to avoid deep recursion
            for (const child of node.children) {
                sortChildren(child);
            }
        }
    };


    sortChildren(root);

    return root.children;
}


export function removeNodesFromTree(
    tree: DDBookmarkTreeNode[],
    shouldRemove: (node: DDBookmarkTreeNode) => boolean
): DDBookmarkTreeNode[] {
    if (!tree) return [];
    return tree.reduce<DDBookmarkTreeNode[]>((acc, node) => {
        if (shouldRemove(node)) {
            // 如果节点应该被删除，但它有子节点，我们将子节点提升到当前级别
            if (node.children && node.children.length > 0) {
                acc.push(...removeNodesFromTree(node.children, shouldRemove));
            }
            // 如果节点应该被删除且没有子节点，我们直接跳过它
        } else {
            // 如果节点不应该被删除，我们保留它，并递归处理它的子节点
            const newNode = { ...node };
            if (newNode.children) {
                newNode.children = removeNodesFromTree(newNode.children, shouldRemove);
            }
            acc.push(newNode);
        }
        return acc;
    }, []);
}

export function findNodeInTree(
    tree: DDBookmarkTreeNode[],
    predicate: (node: DDBookmarkTreeNode) => boolean
): DDBookmarkTreeNode | null {
    const queue: DDBookmarkTreeNode[] = [...tree];

    while (queue.length > 0) {
        const node = queue.shift()!;

        if (predicate(node)) {
            return node;
        }

        if (node.children && node.children.length > 0) {
            queue.push(...node.children);
        }
    }

    return null;
}

// 扁平化树结构
type FlatTransformFunction<T> = (bookmark: Bookmarks.BookmarkTreeNode, level: number) => T;
export function transformBookmarksFlat<T>(
    bookmarks: Bookmarks.BookmarkTreeNode[],
    transform: FlatTransformFunction<T>,
    level = 1,
    accumulator: T[] = []
): T[] {
    if (!bookmarks) return accumulator;
    bookmarks.forEach(bookmark => {
        const transformed = transform(bookmark, level);
        accumulator.push(transformed); // 将转换结果添加到累加器中

        if (bookmark.children) {
            transformBookmarksFlat(bookmark.children, transform, level + 1, accumulator); // 递归处理子节点
        }
    });

    return accumulator; // 返回累加器作为结果
}

// 将书签树转换为数组
export const transformBookmarks2Array = (bookmarks: Bookmarks.BookmarkTreeNode[]): Bookmarks.BookmarkTreeNode[] => {
    const toObj: FlatTransformFunction<Bookmarks.BookmarkTreeNode> = (bookmark, level) => {
        return bookmark;
    };
    return transformBookmarksFlat(bookmarks, toObj);
}


// 将书签树转换为 Markdown 格式
export const transformBookmarks2Md = (bookmarks: Bookmarks.BookmarkTreeNode[]): string[] => {
    const toMarkdown: FlatTransformFunction<string> = (bookmark, level) => {
        const hashes = '#'.repeat(level);
        return `${hashes} [${bookmark.title}]${bookmark.url ? `(${bookmark.url})` : ''}\n`;
    };
    return transformBookmarksFlat(bookmarks, toMarkdown);
}


type TransformFunction<T> = (bookmark: Bookmarks.BookmarkTreeNode, level: number) => T;
export function transformBookmarksStructured<T>(
    bookmarks: Bookmarks.BookmarkTreeNode[],
    transform: TransformFunction<T>,
    level = 1
): T[] {
    return _.map(bookmarks, (bookmark) => {
        const result = transform(bookmark, level);
        if (bookmark.children && bookmark.children.length > 0) {
            return {
                ...result,
                children: transformBookmarksStructured(bookmark.children, transform, level + 1)
            };
        }

        return result;
    });
}





export function deserializeMarkdownToTree(markdownLines: string[]): Bookmarks.BookmarkTreeNode[] {
    let idCounter = 0;
    const generateId = () => (++idCounter).toString();

    const root: Bookmarks.BookmarkTreeNode = {
        id: generateId(),
        title: 'BookmarksAI',
        children: []
    };
    const stack: Bookmarks.BookmarkTreeNode[] = [root];

    markdownLines.forEach(line => {
        const level = (line.match(/^#+/) || [''])[0].length;
        const title = line.replace(/^#+\s*/, '').trim();

        while (stack.length > level) {
            stack.pop();
        }

        const parent = stack[stack.length - 1];
        const newNode: Bookmarks.BookmarkTreeNode = {
            id: generateId(),
            parentId: parent.id,
            title,
            children: []
        };

        if (!parent.children) {
            parent.children = [];
        }
        newNode.index = parent.children.length;
        parent.children.push(newNode);

        stack.push(newNode);
    });

    // Remove the root node and return its children
    return [root] || [];
}


