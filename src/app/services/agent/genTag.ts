import {
    RunnableSequence,
} from '@langchain/core/runnables';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { JsonOutputParser, StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI } from '@langchain/openai';
import { tagClassifierPrompt } from './tagClassifier';
import { bookmarkCategorizationPrompt } from './bookmarkClassifier';
import * as _ from 'lodash-es';

type GenerateTagsAgentChainInput = {
    text: string;
    categories: string[];
    language?: string;
    contentType?: string;
};

const strParser = new StringOutputParser();

// Step 1: 内容分析专家
const analyzeContentPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an expert in natural language processing and text classification, specializing in analyzing browser bookmarks. Your task is to assign 3 to 5 highly relevant tags to the given bookmark text. Avoid unnecessary apologies and review conversation history to prevent repetition of errors.
    Content Type: {contentType}
    User Language: {language} (adapt your language accordingly)
    Follow these steps in our conversation:
    
    Provide a brief analysis of the given bookmark text between <TEXT_ANALYSIS> tags.
    List potential tag categories and your reasoning between <TAGGING_PLAN> tags.
    Provide the final 3 to 5 tags, separated by commas, between <OUTPUT> tags.
    
    Only request clarification when absolutely necessary. Keep responses concise and clear.
    [Rules]
    
    Proper nouns, technical terms, and brand names should be considered key concepts and potential tag candidates.
    When analyzing bookmark text, consider:
    a. The main and secondary topics of the bookmark
    b. The likely purpose or utility of the bookmarked page
    c. The potential target audience
    d. Key concepts, technologies, or tools mentioned
    When selecting tags, ensure:
    a. Tags accurately reflect the bookmark's content
    b. Tags are mutually exclusive to avoid redundancy
    c. Tags are general enough for classification and retrieval
    d. The number of tags is between 3 and 5
    Tagging conventions for specific cases:
    a. For brand names or product names,For general concept, For acronyms, use  lowercase them all
    Prioritize tags that:
    a. Reflect the primary purpose or content of the bookmarked page
    b. Indicate the technology stack or tools, if relevant
    c. Suggest the skill level or target audience (e.g., "beginner", "advanced")
    d. Capture any unique or standout features of the bookmarked resource
    
    Remember, ideal tags should be concise, relevant, and descriptive, allowing users to quickly understand the core content of the bookmark.
    Based on these guidelines, analyze and assign tags to the following bookmark text:`],
    ["human", "Here's the bookmark text you need to analyze: {text}"]
]);



// Step 3: 标签生成专家
const generateTagsPrompt = ChatPromptTemplate.fromMessages([
    ["system", `基于之前的分析和计划，你现在是一位标签生成专家,
        
    用户语言: {language}
    内容类型: {contentType}

    [观察分析结果]
    {firstAnalysis}

    [要求] 合格的标签
    - 简洁、相关且具有描述性，使用户能够快速理解网页的核心内容。
    - 字数3~10个字符之间。
    - 标签之间相互独立，避免重复。
    - 标签数量在1到5个之间。

    [格式]
    最终输出的结果用逗号分隔,
    [例如1]:
    学习,编程,教程
    [例如2]:
    科技,新闻,创业,人工智能


    以下是的生成最后的标签: 

。`],

]);

export const handleGenerateTagsAgent = async (
    input: GenerateTagsAgentChainInput,
    model: ChatOpenAI,
    config?: { apiKey: string, apiBaseUrl: string },
) => {
    
    const categories = input.categories;
    console.log('准备处理tag', input.text)

    // 标签分类Agent
    const tagClassifierSequence = RunnableSequence.from([
        (data) => {
            return {
                categories: categories.map(item => item.replaceAll('#', '')).join('\n'),
                tags: data.finalTags,
            };
        },
        tagClassifierPrompt,
        new ChatOpenAI({
            temperature: 0,
            modelName: 'gpt-4o-mini',
            streaming: false,
            maxRetries: 2,

        }, {
            apiKey: config?.apiKey || process.env.OPENAI_API_KEY!,
            baseURL: config?.apiBaseUrl || process.env.OPENAI_BASE_URL,
        }).bind({
            response_format: { "type": "json_object" }
        }),
        new JsonOutputParser()
    ]);
    // bookmark分类Agent
    const bookmarkClassifierSequence = RunnableSequence.from([
        (data) => {
            return {
                text: input.text,
                categories: categories.map(item => item.replaceAll('#', '')).join('\n'),
                tags: data.finalTags,
            };
        },
        bookmarkCategorizationPrompt,
        new ChatOpenAI({
            temperature: 0,
            modelName: 'gpt-4o-mini',
            streaming: false,
            maxRetries: 2,

        }, {
            apiKey: process.env.OPENAI_API_KEY!,
            baseURL: process.env.OPENAI_BASE_URL,
        }),
        new StringOutputParser()
    ]);


    const chain = RunnableSequence.from([
        {
            firstAnalysis: RunnableSequence.from([
                analyzeContentPrompt,
                model,
                strParser
            ]),
        },
        {
            finalTags: RunnableSequence.from([
                (data) => {
                    return {
                        text: data.text,
                        firstAnalysis: data.firstAnalysis,
                        tags: data.tags,
                        language: language || 'English',
                        contentType: contentType || 'Browser Bookmark'
                    };
                },
                generateTagsPrompt,
                model,
                strParser
            ]),
        },
        {
            finalTags: (prev: any) => _.compact(prev.finalTags.split(',')).map((item: string) => item.trim().replace(/["'`\\]/g, '')),
            tagClassifierResult: tagClassifierSequence
        }, {
            tags: (prev: any) => prev.finalTags,
            tagClassifierResult: (prev: any) => prev.tagClassifierResult,
            bookmarkClassifierResult: bookmarkClassifierSequence
        }
    ]);

    try {
        const result = await chain.invoke({
            text: input.text,
            language: language || 'English',
            contentType: contentType || 'Browser Bookmark'
        });
        return {
            tags: result.tags,
            tagCategories: result.tagClassifierResult,
            bookmarkCategory: result.bookmarkClassifierResult

        }
    } catch (error) {
        console.log(`error`, error);
        throw error;
    }
};