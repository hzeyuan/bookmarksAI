import { useBookmarkStore } from '@src/hooks/useBookmarkStore';
import React, { useMemo } from 'react';
import type { Bookmarks } from 'webextension-polyfill';
import TreeView, { flattenTree } from "react-accessible-treeview";
import { cn } from '@lib/utils';
import { useBookmarkNavStore } from '@src/hooks/useBookmarkNavStore';
import { transformBookmarksStructured } from '@src/app/utils';
import { getCategoryColor } from '@src/app/utils/color';
interface NavigationProps {
    nestedFolder: Bookmarks.BookmarkTreeNode[];
}

const Navigation: React.FC<NavigationProps> = (props) => {
    const structuredData = transformBookmarksStructured(props.nestedFolder, (bookmark, level) => {
        const node = bookmark.children ? {
            name: bookmark.title,
            children: bookmark.children
        } : {
            name: bookmark.title,
        }
        return {
            ...node,
            metadata: {
                ...bookmark,
            }
        };
    })

    if (structuredData.length == 0) return null;

    const data = flattenTree({
        id: 'Bookmarks Bar',
        children: structuredData
    });
    const defaultExpandedIds = data.map((d) => d.id);
    return (
        <div className='space-y-1'>
            <TreeView
                multiSelect={false}
                defaultSelectedIds={defaultExpandedIds.slice(0, 1)}
                defaultExpandedIds={defaultExpandedIds}
                data={data}
                nodeRenderer={({ element, getNodeProps, handleExpand, isExpanded, isSelected, isBranch, level, handleSelect }) => (
                    < li
                        {...getNodeProps({
                            onClick: (e) => {
                                const id = element.metadata.id as string;
                                useBookmarkNavStore.getState().setCurSelectedBookmarkId(id);
                                handleExpand(e);
                                handleSelect(e)
                            }
                        })}
                        style={{
                            paddingLeft: 20 * (level - 1)
                        }}
                        className={
                            cn("items-center group flex justify-between gap-x-3 rounded-md p-2 text-gray-700 dark:text-gray-400 hover:text-main-500 hover:bg-gray-50 dark:hover:pintree-bg-gray-800 bg-opacity-50",
                                isSelected ? 'sidebar-active' : '',
                            )
                        }

                    >
                        <div className="flex items-center space-x-2 truncate">
                            <span>
                                <svg
                                    style={{
                                        color: isSelected ? getCategoryColor(element.name) : '',
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 7a2 2 0 012-2h4l2 2h7a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                                    />
                                </svg>
                            </span>
                            <a className="flex text-sm leading-6 font-semibold dark:text-gray-400">
                                {/* {element.metadata.id} - */}
                                {element.name}
                            </a>
                        </div>


                        <span className={cn(
                            "ml-2 transform transition-transform",
                            isExpanded ? 'rotate-90' : ''
                        )}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </span>
                    </li>


                )}
            />
        </div>


    )

};

export default Navigation;