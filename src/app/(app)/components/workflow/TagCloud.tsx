import React, { useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from 'react';
import { VChart, type IVChart } from '@visactor/react-vchart';
import ReactDOM from 'react-dom/client';
import type { Tag } from '@src/hooks/useTagsStore';

const spec = {
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
    data: {
        name: 'baseData',
        values: []
    }
};


export interface TagCloudHandle {
    updateCloudData: (values: Tag[]) => void;
    updateCloudSpec: (newSpec: any) => void;  // You might want to define a more specific type for newSpec
    getVChartInstance: () => IVChart | null;
}

interface TagCloudProps {
}


export const TagCloud = forwardRef<TagCloudHandle, TagCloudProps>(({ }, ref) => {
    const vChartRef = useRef<IVChart>(null);

    useImperativeHandle(ref, () => ({
        updateCloudData: (values) => {
            vChartRef.current?.updateData('baseData', values);
        },
        updateCloudSpec: (newSpec) => {
            console.log('vChartRef updateCloudSpec', vChartRef);
            vChartRef.current?.updateSpec(newSpec);
        },
        getVChartInstance: () => vChartRef.current
    }));


    const memoizedSpec = useMemo(() => ({
        ...spec,
        large: true,
        largeThreshold: 500,
        progressiveStep: 250,
        progressiveThreshold: 1000
    }), []);


    return (
        <div className="h-[60vh]">
            <VChart
                ref={vChartRef}
                options={{
                    ReactDOM,
                    // mode: "desktop-browser"
                }}
                data={{
                    name: 'baseData',
                    values: [],
                }}
                spec={memoizedSpec}
            />
        </div>
    );
});

export default TagCloud