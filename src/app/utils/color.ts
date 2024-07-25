import randomColor from 'randomcolor';

const baseHues = [
    0,    // 红色
    30,   // 橙色
    60,   // 黄色
    120,  // 绿色
    180,  // 青色
    210,  // 蓝色
    270,  // 紫色
    300   // 粉红色
];

// 为分类分配基础色相
const categoryColors = new Map();
let hueIndex = 0;

// 原始的 getCategoryHue 函数
export function getCategoryColor(category) {
    if (!categoryColors.has(category)) {
        const baseHue = baseHues[hueIndex % baseHues.length];
        categoryColors.set(category, randomColor({
            hue: baseHue,
            luminosity: 'light',
            format: 'hsl'
        }));
        hueIndex++;
    }
    return categoryColors.get(category);
}

// 改进的 getTagColor 函数
export function getTagColor(tag, category) {
    const categoryColor = getCategoryColor(category);
    const { h, s, l } = categoryColor;

    // 在基础色相周围的较小范围内变化，以保持类别的整体色调
    const hueRange = [h - 15, h + 15];

    let seed = 0;
    for (let i = 0; i < tag.length; i++) {
        const char = tag.charCodeAt(i);
        seed = ((seed << 5) - seed) + char;
        seed = seed & seed;
    }

    // 扩大色相范围，增加饱和度和亮度的变化
    // const hueRange = [(baseHue - 30 + 360) % 360, (baseHue + 30) % 360];
    const saturationRange = [50, 100]; // 增加饱和度范围
    const brightnessRange = [70, 90]; // 控制亮度范围，避免过暗或过亮

    return randomColor({
        hue: hueRange,
        luminosity: 'custom',
        seed: Math.abs(seed),
        format: 'hsla'
    }).replace(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%,?\s*(\d*\.?\d+)?\)/, (match, h, s, l, a) => {
        const newS = Math.floor(saturationRange[0] + (seed % (saturationRange[1] - saturationRange[0])));
        const newL = Math.floor(brightnessRange[0] + (seed % (brightnessRange[1] - brightnessRange[0])));
        return `hsl(${h}, ${newS}%, ${newL}%)`;
    });
}
