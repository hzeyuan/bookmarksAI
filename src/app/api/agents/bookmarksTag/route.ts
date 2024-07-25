import { ChatOpenAI } from "@langchain/openai";
import { handleGenerateTagsAgent } from "@src/app/services/agent/genTag";
import { NextRequest, NextResponse } from "next/server";
import type { Bookmarks } from "webextension-polyfill";


export async function POST(req: NextRequest) {
    let { input } = await req.json();
    const model = new ChatOpenAI({
        temperature: 0,
        modelName: 'gpt-4o-mini',
        streaming: false,
        maxRetries: 2,
        maxTokens: 500,
        apiKey: input?.config?.apiKey || process.env.OPENAI_API_KEY!,
    }, {
        apiKey: input?.config?.apiKey || process.env.OPENAI_API_KEY!,
        baseURL: input?.config?.apiBaseUrl || process.env.OPENAI_BASE_URL,
    });

    const bookmark = input.bookmark as Bookmarks.BookmarkTreeNode;
    const text = bookmark.title;
    const result = await handleGenerateTagsAgent({
        text,
        categories: input.categories,
        language: input.language,
    }, model, input?.config);
    console.log('生成的tag为', result);
    return NextResponse.json({ result: result });
}