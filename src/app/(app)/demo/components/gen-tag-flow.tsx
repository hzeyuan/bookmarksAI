"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useBookmarkStore, type DDBookmarkTreeNode } from "@src/hooks/useBookmarkStore";
import { Card, CardContent, CardHeader } from "@src/components/ui/card";
import ShimmerButton from "@src/components/ui/shimmer-button";
import { TagCloud, type TagCloudHandle } from "../../components/workflow/TagCloud";
import * as _ from 'lodash-es';
import { useTagsStore, type Tag } from "@src/hooks/useTagsStore";
import { ProcessedBookmark } from "../../components/workflow";
import { Badge } from "@components/ui/badge";




export const GenTagFlow = ({ ...props }) => {

    const bookmarks = useBookmarkStore((state) => state.bookmarks).filter(b => b.url);
    const processedBookmarks = useMemo(() => {
        return bookmarks.filter(b => b.isTagged);
    }, [bookmarks])

    const containerRef = useRef(null);
    // const tags = useTagsStore((state) => state.tags);
    const tagCloudRef = useRef<TagCloudHandle>(null);


    const handleUpdateCloud = useCallback(
        (values) => {
            tagCloudRef.current?.updateCloudSpec({
                type: 'wordCloud',
                nameField: 'category',
                valueField: 'category_count',
                seriesField: 'category',
                wordCloudConfig: {
                    zoomToFit: {
                        enlarge: true,
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
        return <TagCloud key='my-tag-cloud' ref={tagCloudRef}

        />;
    }, []);

    const handleUpdateCloudWithThrottle = useCallback(_.throttle(handleUpdateCloud, 1800), [tagCloudRef]);

    const progressValue = useMemo(() => {
        // console.log('bookmarks', bookmarks, processedBookmarks, bookmarks.filter(b => !b.isTagged));
        return (processedBookmarks.length / bookmarks.length) || 0;
    }, [processedBookmarks.length, bookmarks.length])

    useEffect(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }, [processedBookmarks]);

    useEffect(() => {
        const currentTags = useTagsStore.getState().tags;
        const newTags = _.map(_.groupBy(currentTags, 'category'), (value, key) => ({
            category: key,
            category_count: value.length,
        }));
        const readyAndUpdateCloud = () => {
            console.log('newTags', newTags);
            if (tagCloudRef.current?.getVChartInstance()) {
                handleUpdateCloudWithThrottle(newTags);
                return true;
            } else {
                return false;
            }
        }
        if (!readyAndUpdateCloud()) {
            setTimeout(() => {
                readyAndUpdateCloud();
            }, 1000);
        }
    }, [useTagsStore.getState().tags, tagCloudRef])

    return (
        <>
            <Card className={cn('relative bg-background')}  {...props}>
                <CardHeader className="">
                    <div className="relative mb-5 h-2 rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-purple-500" style={{ width: `${(progressValue * 100).toFixed(2)}%` }} />
                        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-900">
                            {(progressValue * 100).toFixed(2)}%
                        </span>
                        <div className=" flex gap-x-2 py-4">
                            <Badge variant="outline" className=" bg-green-600 ">SUCCESS: {processedBookmarks.length}</Badge>
                            <Badge variant="outline">TODO: {bookmarks.length - processedBookmarks.length}</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent >
                    <div className="grid grid-cols-2 min-h-[60vh] ">
                        {memoizedTagCloud}
                        <div
                            className="p-4 relative flex flex-col gap-4 overflow-hidden overflow-y-auto  h-[60vh]"
                            ref={containerRef}
                        >

                            <AnimatePresence>
                                {processedBookmarks?.map((bookmark, index) => {
                                    return (
                                        <ProcessedBookmark bookmark={bookmark}></ProcessedBookmark>
                                    )
                                })}
                            </AnimatePresence>

                        </div>
                    </div>

                </CardContent>

            </Card>
        </>

    )
}