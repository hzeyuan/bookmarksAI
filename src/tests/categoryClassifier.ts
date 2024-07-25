import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { ChatOpenAI } from '@langchain/openai';
import { categoryClassifierAgent } from "@src/app/services/agent/categoryClassifier";
import { FOLDER_MARKDOWN } from "@src/app/(app)/mock";


; (async () => {

    const model = new ChatOpenAI({
        temperature: 0,
        // topP: 0.9,
        modelName: 'gpt-4o-mini',
        streaming: false,
        maxRetries: 2,
    }, {
        apiKey: process.env.OPENAI_API_KEY!,
        baseURL: process.env.OPENAI_BASE_URL,
    }).bind({
        response_format: { "type": "json_object" }
    });
    const categories = FOLDER_MARKDOWN.split('\n').filter(item => item.startsWith('#'));
    const res = await categoryClassifierAgent({
        categories: categories,
        tags: '招聘,全栈工程师,广州,IT行业'.split(','),
    }, model) as string;
    console.log('res', res);
})();

