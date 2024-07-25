"use client"
import IconCloud from "@src/components/icon-cloud";
import { useBookmarkStore, type DDBookmarkTreeNode } from "@src/hooks/useBookmarkStore";
import { BOOKMARKS } from "../mock";
import { extractDomainsFromBookmarks } from "@src/app/utils/aggregation";

interface BookmarksIconCloudProps {
    bookmarks: DDBookmarkTreeNode[]
}
export const BookmarksIconCloud: React.FC<BookmarksIconCloudProps> = ({
    bookmarks
}) => {

    const domains = extractDomainsFromBookmarks(bookmarks);
    return (
        <div className="  relative flex h-full w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg border bg-background px-20 pb-20 pt-8 ">
            <h2 className="  absolute top-4 left-4 text-2xl font-semibold leading-none tracking-tight">Bookmarks Domain</h2>
            <IconCloud
                customDomains={domains}
            />
        </div>
    );
}


export default BookmarksIconCloud;