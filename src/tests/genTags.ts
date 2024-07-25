import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { ChatOpenAI } from '@langchain/openai';
import { handleGenerateTagsAgent } from "@src/app/services/agent/genTag";


; (async () => {
    const text = "如何写出一个惊艳面试官的深拷贝? - code秘密花园 - SegmentFault 思否";
    const model = new ChatOpenAI({
        temperature: 0,
        // topP: 0.9,
        modelName: 'gpt-4o-mini',
        streaming: false,
        maxRetries: 3,
    }, {
        apiKey: process.env.OPENAI_API_KEY!,
        baseURL: process.env.OPENAI_BASE_URL,
    });
    const res = await handleGenerateTagsAgent({
        text
    }, model);


})();