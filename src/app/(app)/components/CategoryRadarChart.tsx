"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@src/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@src/components/ui/chart"
const chartData = [
    { category: "信息与媒体", value: 186 },
    { category: "社交与交流", value: 305 },
    { category: "娱乐与休闲", value: 237 },
    { category: "学习与教育", value: 273 },
    { category: "工作与生产力", value: 209 },
    { category: "购物与消费", value: 214 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function CategoryRadarChart() {
    return (
        <Card>
            <CardHeader className="items-center pb-4">
                <CardTitle>Radar Chart</CardTitle>
                <CardDescription>
                    Showing total visitors for the last 6 months
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer

                    config={chartConfig}
                    className="mx-auto aspect-square  "
                >
                    <RadarChart data={chartData}>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <PolarAngleAxis dataKey="category" />
                        <PolarGrid />
                        <Radar
                            dataKey="value"
                            fill="var(--color-desktop)"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    January - June 2024
                </div>
            </CardFooter>
        </Card>
    )
}
