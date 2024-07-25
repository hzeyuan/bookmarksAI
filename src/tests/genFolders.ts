import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { ChatOpenAI } from '@langchain/openai';
import { handleGenerateFolderAgent } from "@src/app/services/agent/genFolder";
import { buildTree, transformBookmarks2Array } from "@src/app/utils";
import { BOOKMARKS } from "@src/app/(app)/mock";




console.group('process.env.OPENAI_BASE_URL', process.env.OPENAI_BASE_URL)

    ; (async () => {
        // console.group('BOOKMARKS', BOOKMARKS);
        const bookmarks = transformBookmarks2Array(BOOKMARKS);
        const folders = bookmarks.filter(item => !item.url).map(item => item.title);
        console.log('folder', folders);
        const model = new ChatOpenAI({
            temperature: 0,
            // topP: 0.9,
            modelName: 'gpt-4o-mini',
            streaming: false,
            maxRetries: 2,
        }, {
            apiKey: process.env.OPENAI_API_KEY!,
            baseURL: process.env.OPENAI_BASE_URL,
        });

        const res = await handleGenerateFolderAgent({
            folders,
            // bookmarks,
            language: 'zh',
        }, {
            model,
            json: false,
            stream: false
        }) as string;
        console.log('res', res);

        // let s = ''
        // for await (const chunk of res) {
        //     s += chunk
        //     console.log(s);
        // }

        // const res = "```\n# 主类别\n## 游戏资源\n### 待玩耍\n### 游戏源码\n## 开发工具\n### 前端\n### 后端\n#### Go\n#### Python\n## 职业发展\n### 内推\n### 教程网址等\n## 技术领域\n### AI\n### 电商\n## 日常工具\n### 微信\n### 移动设备书签\n## 其他\n### 其他书签\n### 新建文件夹\n```\n\n由于提供的书签列表为 \"undefined\"，无法进行具体的分类和调整。因此，新的文件夹结构与现有的文件夹结构保持一致。如果有具体的书签列表，可以进一步进行分类和调整。"
        // const category = res.split('\n');
        // const filteredCategory = category.filter(item => item.startsWith('#'));
        // console.log(filteredCategory);

        // const markdownTree = buildTree(filteredCategory, 1);
        // console.dir(markdownTree, { depth: 10 });
        // console.log('category', category);

        // 解析xml,提取其中的output
        // const outputMatch = res.match(/<OUTPUT>([\s\S]*?)<\/OUTPUT>/);
        // if (!outputMatch) {
        //     return [];
        // }

        // const outputContent = outputMatch[1];
        // 用markdown解析  转换为json,
        // const json = JSON.parse(outputContent);

    })();

