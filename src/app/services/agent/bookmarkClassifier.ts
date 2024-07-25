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

export const bookmarkCategorizationPrompt = ChatPromptTemplate.fromMessages([
    ["system", `对给定的书签信息进行综合分析，选择一个最合适的整体分类。
  
  分析维度：
  1. 内容主题：评估文本的主要话题和焦点。
  2. 目的：确定内容的意图（如教育、娱乐、新闻等）。
  3. 受众：考虑内容适合的目标群体。
  4. AI生成标签：利用这些标签作为内容关键特征的指示。
  5. URL结构：分析网址以获取额外的分类线索。
  
  规则：
  1. 综合考虑所有维度，选择一个最能代表书签整体特性的分类。
  2. 如果维度间存在冲突，优先考虑内容主题和目的。
  3. 只选择一个最合适的分类，即使内容可能跨越多个类别。
  4. 如果无法确定分类，使用"其他"类别。
  
  直接返回所选分类名称，不需要解释或额外格式。`],
    ["human", `文本信息: {text}
  标签: {tags}
  可选分类: {categories}
  
  返回一个分类名称。`]
  ]);



export const bookmarkClassifierAgent = async (
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
        bookmarkCategorizationPrompt,
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