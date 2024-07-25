import { arrayToTree, transformBookmarksStructured } from "@src/app/utils";
import { ChartContainer, type ChartConfig } from "@src/components/ui/chart";
import { VChart } from "@visactor/react-vchart";
import { useMemo } from "react";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export const FolderTreemapChart: React.FC<{
    s: string;
}> = ({ s }) => {
    const processedData = useMemo(() => {
        if (!s) return [];
        const filteredCategory = s.split('\n').filter(item => item.startsWith('#'));
        const folderTree = arrayToTree(filteredCategory);
        return transformBookmarksStructured(folderTree.children, (bookmark, level) => {
            const node = bookmark.children ? {
                name: bookmark.title,
                children: bookmark.children
            } : {
                name: bookmark.title,
            }
            return {
                ...node,
                value: 1,
            };
        })
    }, [s]);


    if (!processedData || !processedData.length) return null;

    const spec = {
        type: 'treemap',
        data: {
            name: 'folder',
            values: processedData,

        },
        categoryField: 'name',
        valueField: 'index',
        aspectRatio: 1,
        gapWidth: 4,
        nodePadding: 0,
        label: {
            visible: true,
            style: {
                fontSize: 12
            }
        },
        drill: true,
        nonLeaf: {
            visible: true
        },
        nonLeafLabel: {
            visible: true,
            position: 'top',
            padding: 30,
            style: {
                x: data => {
                    return data.labelRect?.x0 + 4;
                },
                textAlign: 'left',
                text: data => [data.name]
            }
        },
        title: {
            visible: true,
            text: 'The folder structure of bookmarks',
        }
    };

    return (
        <ChartContainer config={chartConfig}>
            <VChart
                spec={spec}
            />
        </ChartContainer>

    );
};