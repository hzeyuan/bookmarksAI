import { AnimatedList } from "@src/components/ui/animated-list";
import { ProcessedBookmark } from "../../workflow";
import { cn } from "@lib/utils";
import mockTaggedBookmarks from "@src/app/(app)/mock/taggedBookmarks.json"


const processedBookmarks = mockTaggedBookmarks;

export function AnimatedListDemo({
    className,
}: {
    className?: string;
}) {
    return (
        <div
            className={cn(
                "relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl",
                className,
            )}
        >
            <AnimatedList>
                {processedBookmarks?.map((bookmark, index) => {
                    return (
                        <ProcessedBookmark key={bookmark.id} bookmark={bookmark}></ProcessedBookmark>
                    )
                })}
            </AnimatedList>
        </div>
    );
}