"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type DDBookmarkTreeNode } from "@src/hooks/useBookmarkStore";
import { Card, CardContent, CardHeader } from "@src/components/ui/card";
import { TagCloud, type TagCloudHandle } from "./TagCloud";
import * as _ from 'lodash-es';
import { type Tag } from "@src/hooks/useTagsStore";
import pLimit from 'p-limit';
import { getCategoryColor, getTagColor } from "@src/app/utils/color";
import React from "react";
import { useVirtual } from 'react-virtual';
import taggedBookmarks from '@src/app/(app)/mock/taggedBookmarks.json'
import UnderlineHoverText from "@src/components/ui/underline-hover-text";

export const ProcessedBookmark = React.memo(({ bookmark }: { bookmark: DDBookmarkTreeNode }) => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, originY: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 40 }}
        >
            <div className={cn(
                "flex relative",
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
            )}>
                <img
                    src={`https://api.iowen.cn/favicon/${bookmark.url?.replace(/^https?:\/\//, '').split('/')[0]}.png`}
                    alt="Hey, I'm Chi."
                    className="w-8 h-8 mr-4 rounded-full flex-shrink-0 card-icon-bg"
                />
                <div className="flex flex-col overflow-hidden">
                    <h2
                        className="text-sm font-semibold mb-1 truncate dark:text-gray-400">
                        {bookmark.title}
                        {bookmark.parentId}
                    </h2>
                    <p className="text-xs text-gray-400 truncate  mb-1">
                        {bookmark.url}
                    </p>

                    <div
                        style={{
                            borderTop: `2px solid ${getCategoryColor(bookmark.parentName)}`
                        }}
                        className="flex gap-x-1  overflow-x-auto">
                        {(bookmark.tags)?.map(tag => {
                            const color = getTagColor(tag.name, tag.category || '');
                            return (
                                <li
                                    onClick={() => {
                                    }}
                                    className={cn("hover:shadow-lg        transition-shadow duration-300 ease-in-out list-none",
                                    )}
                                    key={tag.id}
                                    style={{
                                        fontSize: ".8rem",
                                        height: "32px",
                                        marginRight: ".5rem",
                                        marginTop: ".5rem",
                                        WebkitUserSelect: "none",
                                        userSelect: "none",
                                        whiteSpace: "nowrap"
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
                                            width: "1px"

                                        }}
                                        type="checkbox" id="" />
                                    <label
                                        style={{
                                            alignItems: "center",
                                            border: "2px solid hsl(var(--border))",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            display: "flex",
                                            lineHeight: "1.5",
                                            opacity: ".85",
                                            padding: ".275rem .8rem",
                                            transition: "opacity .2s ease-out"
                                        }}
                                    >
                                        {tag.category} -
                                        {tag.name}
                                        <span
                                            style={{
                                                backgroundColor: color,
                                                width: "10px",
                                                height: "10px",
                                                borderRadius: "50%",
                                                marginLeft: "8px"
                                            }}
                                        >
                                        </span>
                                    </label>
                                </li>
                            )
                        })}

                    </div>
                </div>

            </div>

        </motion.div>
    )
});

export const MockWorkflow = ({ ...props }) => {
    const [bookmarks, setBookmarks] = useState(props.bookmarks.filter(b => b.url));
    const containerRef = useRef(null);

    const processedBookmarks = useMemo(() => {
        return bookmarks.filter(b => b.isTagged);
    }, [bookmarks])

    const upsertBookmark = (bookmark) => {
        const bookmarkIndex = bookmarks.findIndex(b => b.id === bookmark.id);
        if (bookmarkIndex === -1) {
            setBookmarks(pre => {
                return [...pre, bookmark as DDBookmarkTreeNode]
            })
        } else {
            setBookmarks(pre => {
                const updatedBookmarks = [...pre];
                updatedBookmarks[bookmarkIndex] = {
                    ...updatedBookmarks[bookmarkIndex],
                    ...bookmark,
                }
                return updatedBookmarks
            });
        }
    }

    const tagsData = useRef<(Tag & {
        category_count: number;
    })[]>([]);

    const tagCloudRef = useRef<TagCloudHandle>(null);
    const handleUpdateCloud = useCallback(
        (values) => {
            console.log('更新词云', values,tagCloudRef);
            tagCloudRef.current?.updateCloudSpec({
                type: 'wordCloud',
                nameField: 'category',
                valueField: 'category_count',
                seriesField: 'category',
                wordCloudConfig: {
                    zoomToFit: {
                        enlarge: true,
                        // shrink: true,
                        // fontSizeLimitMin: 5,
                        fontSizeLimitMax: 20
                    }
                },
                large: true,
                largeThreshold: 500,
                progressiveStep: 250,
                progressiveThreshold: 1000,
                data: {
                    name: 'baseData',
                    values: values
                },
            });
        }, [tagCloudRef]);


    const memoizedTagCloud = useMemo(() => {
        return <TagCloud ref={tagCloudRef} key={'mockTagCloud'} />;
    }, []); // Empty dependency array means this will only run once

    const initWorkflow = () => {
        setBookmarks(bookmarks.map(b => ({
            ...b,
            isTagged: false,
        })))
        tagsData.current = [];
        handleUpdateCloud([])
    }

    const handleUpdateCloudWithThrottle = useCallback(_.throttle(handleUpdateCloud, 1800), [tagCloudRef]);
    const handleGenerateTagsStart = async (mock = false) => {
        initWorkflow();
        const limit = pLimit(6);
        const processBookmark = async (bookmark: DDBookmarkTreeNode, index) => {
            console.log('开始生成tag:', bookmark);
            const mockBookmarks = taggedBookmarks as unknown as DDBookmarkTreeNode[];
            await new Promise(r => setTimeout(r, 1000));
            const newTags = mockBookmarks[index].tags
            console.log('最终生成的newTags', newTags);
            newTags.map(tag => {
                const tagIndex = tagsData.current?.findIndex(t => t.category === tag.category);
                if (tagIndex !== -1) {
                    tagsData.current[tagIndex].category_count++;
                } else {
                    tagsData.current = [...tagsData.current, {
                        ...tag,
                        category_count: 1,
                    }];
                }
            })

            upsertBookmark({
                ...bookmark,
                id: bookmark.id || bookmark.url,
                tags: newTags,
                isTagged: true,
                taggedTime: new Date().getTime(),
                parentName: mockBookmarks[index].parentName,
                parentId: mockBookmarks[index].parentId,
            });
            handleUpdateCloudWithThrottle(tagsData.current);
        };

        const tasks = bookmarks.map((bookmark, index) =>
            limit(() => processBookmark(bookmark, index))
        );

        const results = await Promise.all(tasks);
        console.dir(results);
    }

    useEffect(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, [processedBookmarks]);

    useEffect(() => {
        (taggedBookmarks as unknown as DDBookmarkTreeNode[]).map((bookmark, index) => {
            const newTags = bookmark.tags
            newTags.map(tag => {
                const tagIndex = tagsData.current?.findIndex(t => t.category === tag.category);
                if (tagIndex !== -1) {
                    tagsData.current[tagIndex].category_count++;
                } else {
                    tagsData.current = [...tagsData.current, {
                        ...tag,
                        category_count: 1,
                    }];
                }
            });
        });
        setBookmarks(taggedBookmarks);
        setTimeout(() => {
            handleUpdateCloud(tagsData.current);
        }, 1000)
    }, [tagCloudRef])


    const rowVirtualizer = useVirtual({
        size: processedBookmarks.length,
        parentRef: containerRef,
        estimateSize: useCallback(() => 100, []), // 估计每个项目的高度
        overscan: 5 // 预渲染的额外项目数
    });


    const progressValue = useMemo(() => {
        return (processedBookmarks.length / bookmarks.length);

    }, [processedBookmarks.length, bookmarks.length])


    return (
        <div className="w-full">

            <div className="flex items-center justify-center w-full"
                onClick={() => { handleGenerateTagsStart(false); }}
            >
                <UnderlineHoverText text="Click Here Simulation run"></UnderlineHoverText>
            </div>


            <Card   className={cn('relative bg-background')}  {...props}>
                <CardHeader className="">
                    <div className="relative mb-5 h-2 rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-purple-500" style={{ width: `${(progressValue * 100).toFixed(2)}%` }} />
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-900">
                            {(progressValue * 100).toFixed(2)}%
                        </span>
                    </div>


                </CardHeader>
                <CardContent  >
                    <div className="grid grid-cols-2 min-h-[60vh] ">
                        {memoizedTagCloud}

                        <div
                            ref={containerRef}
                            style={{ height: '60vh', overflow: 'auto' }}
                            className="p-4 relative flex flex-col gap-4 overflow-hidden overflow-y-auto  h-[60vh]"
                        >
                            <div
                                style={{
                                    height: `${rowVirtualizer.totalSize}px`,
                                    width: '100%',
                                    position: 'relative',
                                }}
                            >

                                <AnimatePresence>

                                    {rowVirtualizer.virtualItems.map((virtualRow) => {
                                        const bookmark = processedBookmarks[virtualRow.index];
                                        return (
                                            <div
                                                key={virtualRow.index}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: `${virtualRow.size}px`,
                                                    transform: `translateY(${virtualRow.start}px)`,
                                                }}
                                            >
                                                {bookmark && <ProcessedBookmark bookmark={bookmark} />}
                                            </div>
                                        );
                                    })}
                                </AnimatePresence>

                            </div>
                        </div>

                    </div>

                </CardContent>

            </Card>
        </div>

    )
}

