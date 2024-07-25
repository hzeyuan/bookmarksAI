import type { Bookmarks } from "webextension-polyfill"

export type HandleGenerateNewFolder = (args: {
    folders: string[],
    bookmarks: Bookmarks.BookmarkTreeNode[],
    language?: string
}) => Promise<string>;
export const requestGenerateNewFolder: HandleGenerateNewFolder = async ({
    folders,
    bookmarks,
    language
}) => {
    const storedApiKey = localStorage.getItem('apikey');
    const storedApiBaseUrl = localStorage.getItem('apiBaseUrl') || 'https://api.openai.com/v1'
    return fetch('/api/agents/bookmarksFolder', {
        method: 'POST',
        body: JSON.stringify({
            name: 'generateNewFolder',
            input: {
                folders: folders,
                allBookmarks: bookmarks,
                language: language,
                config: {
                    apiKey: storedApiKey,
                    apiBaseUrl: storedApiBaseUrl,
                }
            }
        })
    }).then(res => res.json()).then(data => {
        return data.result as string;
    })

}

export type GenerateTagsRequest = (args: {
    bookmark: Bookmarks.BookmarkTreeNode
    categories: string[]
    language?: string
}) => Promise<string[]>;
export const generateTagsRequest: GenerateTagsRequest = async (args) => {
    const storedApiKey = localStorage.getItem('apikey');
    const storedApiBaseUrl = localStorage.getItem('apiBaseUrl') || 'https://api.openai.com/v1'
    return fetch('/api/agents/bookmarksTag', {
        method: 'POST',
        body: JSON.stringify({
            name: 'generateTags',
            input: {
                bookmark: args.bookmark,
                categories: args.categories,
                language: args.language,
                config: {
                    apiKey: storedApiKey,
                    apiBaseUrl: storedApiBaseUrl,
                }
            }
        })
    }).then(res => res.json()).then(data => {
        return data.result as string[];
    })
}


export const requestTestConnection = async ({ apiBaseUrl, apiKey }) => {
    try {
        if (!apiKey) {
            alert('Please enter your API Key');
            return;
        }
        if (!apiBaseUrl) {
            alert('Please enter your API Base URL');
            return;
        }
        const response = await fetch(`${apiBaseUrl}/chat/completions`, {
            method: 'post',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                stream: false,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.',
                    },
                    {
                        role: 'user',
                        content: 'hello',
                    },
                ],
            }),
        });
        const data = await response.json();
        if (response.status !== 200) {
            return false;
        }
        else {
            return true;
        }
    } catch (error) {
        console.log('error', error);
        alert('Connection Failed');
    }
};
