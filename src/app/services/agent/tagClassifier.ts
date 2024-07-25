import {
    RunnableSequence,
    RunnableMap,
} from '@langchain/core/runnables';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { jsonrepair } from 'jsonrepair';
import pRetry from 'p-retry';
type CategoryClassifierAgentInput = {
    categories: string[],
    tags: string[],
};

const strParser = new StringOutputParser();

// Step 1: 内容分析专家
export const tagClassifierPrompt = ChatPromptTemplate.fromMessages([
    ["system", `你是一位精通自然语言处理和文本分类的AI助手。你的任务是将给定的标签正确分类到相应的种类中。请遵循以下指南：

  1. 仔细分析每个标签的含义和特征。
  2. 将每个标签分配到最合适的种类中。
  3. 如果一个标签可能属于多个种类，只能选择一个最相关或代表性的种类。
  4. 如果遇到无法分类的标签，将其归入"Other"类别。
  5. 保持客观，不要添加个人观点或额外信息。

  直接返回结果：
  输出一个JSON对象，
  - 键为标签名称
  - 标签对应的种类作为值。
  - 种类必须是给定的种类之一，不要添加额外种类,
  - 输出结果，一个标签对应一个种类，不要包含任何解释或分析，只返回JSON结果。

  确保输出格式正确，便于解析和使用。`],
    ["human", "categories: {categories}\ntags: {tags}\n请对这些标签进行分类并返回JSON结果。"]
]);


// export const tagClassifierPrompt = ChatPromptTemplate.fromMessages([
//     ["system", `You are an AI assistant proficient in natural language processing and text classification. Your task is to correctly categorize the given tags into their respective categories. Please adhere to the following guidelines:
    
//     Analyze the meaning and features of each tag carefully.
//     Assign each tag to the most appropriate category.
//     If a tag could belong to multiple categories, choose the most relevant or representative category.
//     If you encounter a tag that cannot be classified, place it in the "Others" category.
//     Stay objective and avoid adding personal opinions or extra information.
//     Directly return the result:
//     Output a JSON object,
    
//     The key is the tag name.
//     The category to which the tag corresponds as the value.
//     Categories must be one of the given categories, do not add extra categories.
//     Output the results with one tag corresponding to one category, without any explanation or analysis, just return the JSON result.
//     Ensure the output format is correct for easy parsing and use.
    
//     `],
//     ["human", "categories: {categories}\ntags: {tags}\nPlease classify these tags and return the JSON result."]
// ]);




export const tagClassifierAgent = async (
    input: CategoryClassifierAgentInput,
    model: any
) => {

    console.log(`categoryClassifierAgent: input: ${JSON.stringify(input)}`)
    const chain = RunnableSequence.from([
        (data) => {
            return {
                categories: data.categories,
                tags: data.tags,
            };
        },
        tagClassifierPrompt,
        model,
        strParser
    ]);

    const run = async () => {
        try {
            const chainWithRetry = chain.withRetry({
                stopAfterAttempt: 3,
                onFailedAttempt: (error) => {
                    console.log(`error`, error);
                }
            })
            const result = await chainWithRetry.invoke({
                categories: input.categories,
                tags: input.tags,
            })

            return jsonrepair.parse(JSON.stringify(result));
        } catch (error) {
            console.log(`error`, error);
            throw error;
        }
    }
    pRetry(run, {
        retries: 3,
        onFailedAttempt: (error) => {
            console.log(`categoryClassifierAgent error`, error.message);
        }
    });

};