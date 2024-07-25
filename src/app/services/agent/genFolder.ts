import {
    RunnableSequence,
    RunnableMap,
    RunnableLambda,
} from '@langchain/core/runnables';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOpenAI } from '@langchain/openai';
import { transformBookmarks2Md } from '@src/app/utils';
import * as _ from 'lodash-es';
import type { Bookmarks } from 'webextension-polyfill';

type ProcessBookmarkAgentChainInput = {
    folders: string[],
    allBookmarks?: Bookmarks.BookmarkTreeNode[],
    language: string,
    config?: {
        apiKey: string
        apiBaseUrl: string
    }
};

const strParser = new StringOutputParser();

const analyzeCurrentStructure = ChatPromptTemplate.fromMessages([
    ["system", `
    You are an expert in optimizing folder structures for bookmarks. Analyze the provided bookmark list and create an overview of the current structure. Use chain-of-thought reasoning to break down your analysis:
    
    1. Identify main categories
    2. Analyze subcategories and their relationships
    3. Evaluate naming conventions
    4. Assess current depth and breadth
    5. Identify potential areas for improvement
    
    Provide a detailed analysis with your reasoning for each step.
    
    language: {language}
    Current bookmark folders:
    {folders}
    `]
]);

const generateIdeas = ChatPromptTemplate.fromMessages([
    ["system", `
Based on the analysis, generate 3 improved bookmark structures. For each:
    1. Describe the structure
    2. Explain its rationale
    3. List pros and cons
    4. Score it on: Comprehensiveness, Intuitiveness, Scalability, Depth (max 3 levels), Consistency

    Current structure analysis:
    {analysis}

    All bookmarks:
    {bookmarks}
    `]
]);



const finalizeStructure = ChatPromptTemplate.fromMessages([
    ["system", `
    You are a world-class information architecture expert specializing in organizing bookmarks and digital content. Your task is to create a final, universal folder structure for bookmarks that should be as comprehensive, complete, and versatile as possible to accommodate various users and content types.
    
    Please carefully review the previously refined structure and make final adjustments and expansions. During this process, consider the following points:
    
    Generated ideas:
    {ideas}

    Respect user Language Habits: {language}

    1. Comprehensiveness: Ensure coverage of all possible major content categories, including but not limited to:
       - Work/Career-related
       - Personal Development/Learning
       - Entertainment/Leisure
       - News/Current Affairs
       - Health/Wellness
       - Finance/Investment
       - Technology/Science
       - Arts/Culture
       - Social/Community
       - Travel/Exploration
    
    2. Hierarchical Structure:
       - Maintain a maximum depth of 3 levels but ensure each category has an adequate number of subcategories
       - Maintain balance between top-level categories, avoiding some categories being too large while others are too simple
    
    3. Naming Conventions:
       - Use clear, concise, and easily understandable names
       - Maintain consistency in naming style
       - Consider using widely recognized terms or category names
    
    4. Scalability:
       - Leave an "Other" or "Miscellaneous" subcategory under each major category to accommodate future potential new content
       - Consider using some open-ended category names to allow for diverse content classification
    
    5. User-Friendliness:
       - Ensure clear boundaries between categories to avoid confusion where content may overlap
       - Avoid folders like "Frequently Used" or "Recently Added" to maintain a focused and organized structure
    
    6. Universality:
       - The structure should be suitable for users with different backgrounds, interests, and needs
       - Consider cross-cultural and international factors, avoiding the use of terms specific to a particular culture or region
    
    7. Future-Oriented:
       - Include some forward-looking categories like "Emerging Technologies," "Future Trends," etc.
       - Consider current hot topics and potential future development directions
    
    Please use the # symbol to indicate hierarchical relationships and present the final folder structure. For example:
    
    # Main Category 1
    ## Subcategory 1.1
    ### Sub-subcategory 1.1.1
    ## Subcategory 1.2
    # Main Category 2
    ## Subcategory 2.1
    ## Subcategory 2.2
    
   [important!!!]
    Output the results directly without any explanation.
    `]
]);

export const handleGenerateFolderAgent = async (
    input: ProcessBookmarkAgentChainInput,
    options?: {
        model?: any,
        stream?: boolean
    }
) => {
    let { model, stream } = options || {};

    // model = model || new ChatOpenAI({
    //     temperature: 0,
    //     modelName: 'gpt-4o-mini',
    //     streaming: stream,
    //     maxRetries: 2,
    // }, {
    //     apiKey: process.env.OPENAI_API_KEY!,
    //     baseURL: process.env.OPENAI_BASE_URL,
    // });

    const bookmarksStr = input.allBookmarks ? transformBookmarks2Md(input.allBookmarks).join('\n') : '';

    const chain = RunnableSequence.from([
        RunnableMap.from({
            analysis: RunnableSequence.from([
                analyzeCurrentStructure,
                model,
                strParser
            ]),
            folders: () => _.compact(input.folders).join('\n'),
            bookmarks: () => bookmarksStr,
        }),
        {
            ideas: RunnableSequence.from([
                (data) => ({
                    analysis: data.analysis,
                    bookmarks: bookmarksStr,
                }),
                generateIdeas,
                model,
                strParser
            ]),
        },
        {
            finalStructure: RunnableSequence.from([
                (data) => ({
                    ideas: data.ideas,
                    language: input.language,
                }),
                finalizeStructure,
                model,
                strParser
            ])
        },
    ]);

    if (stream) {
        return chain.stream(input);
    } else {
        try {
            const result = await chain.invoke(input);
            return result.finalStructure;
        } catch (error) {
            console.error(`Error in handleGenerateFolderAgent:`, error);
            return "";
        }
    }
};