import { ChatOpenAI } from "@langchain/openai";
import { handleGenerateFolderAgent } from "@src/app/services/agent/genFolder";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req: NextRequest) {
    let { input } = await req.json();
    console.log('input?.config?.apiKey,', input?.config)
    const model = new ChatOpenAI({
        temperature: 0,
        // topP: 0.9,
        modelName: 'gpt-4o-mini',
        streaming: false,
        maxRetries: 2,
        apiKey: input?.config?.apiKey || process.env.OPENAI_API_KEY!,
    }, {
        apiKey: input?.config?.apiKey || process.env.OPENAI_API_KEY!,
        baseURL: input?.config?.apiBaseUrl || process.env.OPENAI_BASE_URL,
    });


    const result = await handleGenerateFolderAgent({
        folders: input.folders,
        allBookmarks: input.allBookmarks,
        language: input.language
    }, {
        model,
        json: false,
        stream: false
    }) as string;
    console.log('result', result);
    const splitResult = result.split('\n');
    const newFolders = splitResult.filter(item => item.startsWith('#'));
    // console.log(newFolders);
    return NextResponse.json({ result: newFolders.join('\n') });
    // return new Response("Not Found", { status: 400 });
}