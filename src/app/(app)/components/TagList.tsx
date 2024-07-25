import React, { useMemo } from "react";
import { cn } from "@lib/utils";
import { getCategoryColor, getTagColor } from "@src/app/utils/color";
import { type Tag } from "@src/hooks/useTagsStore";
import { motion } from "framer-motion";
import * as _ from 'lodash-es';
import BoldCopy from "@src/components/ui/bold-copy";
import type { DDBookmarkTreeNode } from "@src/hooks/useBookmarkStore";

export const TagList: React.FC<{
    bookmarks: DDBookmarkTreeNode[]
}> = ({ bookmarks }) => {
    
    const tags: Tag[] = _.reduce(bookmarks, (acc, bookmark) => {
        return _.union(acc, bookmark.tags);
    }, []);

    const [isViewAll, setIsViewAll] = React.useState(false);

    const categorizedTags = useMemo(() => {
        const grouped = tags.reduce((acc, tag) => {
            const category = tag.category || "Uncategorized";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(tag);
            return acc;
        }, {} as Record<string, typeof tags>);

        const categorizedTags = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
        
        const uniqueCategorizedTags = _.reduce(categorizedTags, (acc, [category, tags]) => {
            const uniqueTags = Array.from(new Set(tags.map((tag) => tag.name))).map((name) =>
                tags.find((tag) => tag.name === name)
            );
            acc.push([category, uniqueTags]);
            return acc;
        }, []);
        return uniqueCategorizedTags;
    }, []);

    return (
        <div className="">
            <BoldCopy
                className="border border-gray-200 dark:border-zinc-800"
                text={`TAG LIST: ${tags.length}`}>

            </BoldCopy>

            <motion.div className="relative  flex w-full flex-col py-2">
                {(isViewAll ? categorizedTags : categorizedTags.slice(0, 6)).map(([category, categoryTags]) => {

                    return (<div key={category} className="my-4">
                        <div className="flex gap-x-2  items-center">
                            <span
                                style={{
                                    backgroundColor: getCategoryColor(category),
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    marginLeft: "8px",
                                }}
                            ></span>
                            <h3 className=" text-xl font-semibold ">{category} ({categoryTags.length})</h3>
                        </div>
                        <div className="flex flex-wrap">
                            {categoryTags.map((tagInfo) => {
                                const color = getTagColor(tagInfo.name, tagInfo.category || "");
                                return (
                                    <li
                                        className={cn(
                                            "hover:shadow-lg transition-shadow duration-300 ease-in-out list-none",
                                        )}
                                        key={tagInfo.id}
                                        style={{
                                            fontSize: ".8rem",
                                            height: "32px",
                                            marginRight: ".5rem",
                                            marginTop: ".5rem",
                                            WebkitUserSelect: "none",
                                            userSelect: "none",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <input
                                            style={{
                                                clip: "rect(0 0 0 0)",
                                                border: "0",
                                                WebkitClipPath: "polygon(0 0, 0 0, 0 0)",
                                                clipPath: "polygon(0 0, 0 0, 0 0)",
                                                height: "1px",
                                                margin: "-1px",
                                                overflow: "hidden",
                                                padding: "0",
                                                position: "absolute",
                                                whiteSpace: "nowrap",
                                                width: "1px",
                                            }}
                                            type="checkbox"
                                            id={`tag-${tagInfo.id}`}
                                        />
                                        <label
                                            htmlFor={`tag-${tagInfo.id}`}
                                            style={{
                                                alignItems: "center",
                                                border: "2px solid hsl(var(--border))",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                display: "flex",
                                                lineHeight: "1.5",
                                                opacity: ".85",
                                                padding: ".275rem .8rem",
                                                transition: "opacity .2s ease-out",
                                            }}
                                        >
                                            {tagInfo.name}
                                            <span
                                                style={{
                                                    backgroundColor: color,
                                                    width: "10px",
                                                    height: "10px",
                                                    borderRadius: "50%",
                                                    marginLeft: "8px",
                                                }}
                                            ></span>
                                        </label>
                                    </li>
                                );
                            })}
                        </div>
                    </div>)
                })}
            </motion.div>

            <div className="flex gap-3 -mt-1">
                <button
                    onClick={() => {
                        setIsViewAll(!isViewAll);
                    }}
                    className="justify-center whitespace-nowrap font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 relative text-white bg-gradient-to-b from-neutral-800 via-neutral-900 to-neutral-800 px-6 py-2 rounded-full group transition-all duration-100 text-lg flex items-center mx-auto w-auto shadow-[0_1px_5px_rgba(0,0,0,0.2)]"

                >
                    {isViewAll ? "Collapse" : "View All"}
                    <div className="w-0 opacity-0 group-hover:w-[16px] group-hover:opacity-100 ml-1 overflow-hidden duration-100 transition-all">
                        →
                    </div>
                </button>
            </div>

        </div>
    );
};