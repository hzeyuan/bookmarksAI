import type { PlasmoMessaging } from "@plasmohq/messaging"
import Browser, { type Bookmarks } from "webextension-polyfill";
import * as _ from 'lodash-es'

const createBookmarkTree = async (bookmarks: Bookmarks.BookmarkTreeNode[], parentId?: string): Promise<void> => {
    for (const bookmark of bookmarks) {
        if (bookmark.children) {
            // This is a folder
            const newFolder = await Browser.bookmarks.create({
                parentId: parentId,
                title: bookmark.title,
            });
            // Recursively create children
            await createBookmarkTree(bookmark.children, newFolder.id);
        } else {
            // This is a bookmark
            await Browser.bookmarks.create({
                parentId: parentId,
                title: bookmark.title,
                url: bookmark.url,
            });
        }
    }
};



const handler: PlasmoMessaging.MessageHandler = async (req: any, res: any) => {
    console.log("Bookmark operation triggered:", req, req.body.type);
    const type = req.body.type;
    try {
        switch (type) {
            case "create":
                // 创建书签
                const newBookmark = await Browser.bookmarks.create(req.bookmark);
                res.send({ bookmark: newBookmark });
                break;
            case "delete":
                // 删除书签
                await Browser.bookmarks.remove(req.id);
                res.send({ success: true });
                break;
            case "update":
                // 更新书签
                const updatedBookmark = await Browser.bookmarks.update(req.id, req.changes);
                res.send({ bookmark: updatedBookmark });
                break;
            case "query":
                // 查询书签
                const results = await Browser.bookmarks.search(req.query);
                res.send({ bookmarks: results });
                break;
            case "getTree":
                // 获取全部书签
                const bookmarksTree = await Browser.bookmarks.getTree();
                res.send({
                    bookmarksTree,
                    // bookmarkCount,
                    // folderCount
                });
                break;
            case 'set':
                // 设置书签
                const tree = await Browser.bookmarks.getTree();
                const rootBookmarkId = tree[0].children[0].id; // 获取书签根文件夹ID
                // 删除所有现有书签
                const children = await Browser.bookmarks.getChildren(rootBookmarkId);
                // for (const child of children) {
                //     await Browser.bookmarks.removeTree(child.id);
                // }

                await createBookmarkTree(req.body.bookmarks)
            
                res.send({ success: true });
                break;
            default:
                res.send({ error: "Unsupported operation" });
        }
    } catch (error) {
        res.send({ error: error.message });
    }
}

export default handler