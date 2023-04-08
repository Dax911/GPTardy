import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "y/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";

// Define types for environment variables
const envSchema = z.object({
  CHATGPT_ORG_ID: z.string(),
  CHATGPT_API_KEY: z.string(),
});
// Validate environment variables
const env = envSchema.parse(process.env);

const configuration = new Configuration({
  organization: env.CHATGPT_ORG_ID,
  apiKey: env.CHATGPT_API_KEY,
});

const openai = new OpenAIApi(configuration);
// Define expected response type

type Category = {
  catTitle: string;
  catData: {
    value: number;
    question: string;
    answer: string;
  }[];
};

type OpenAIResponse = {
  data: {
    choices: {
      text: Category | undefined;
      index: number;
      logprobs: number | null;
      finish_reason: string;
    }[];
  };
};

const fetchNewCategory = async (text: string): Promise<Category> => {
  const buildPrompt = (text: string): string => {
    return `Create a new category of questions and answers. Build the category based on the following phrase "${text}". Be sure to return the jeopardy style response in json format that uses only regular expressions. Be sure that the higher value questions are more difficult than the lower values. Like so:
    
    {
      "catTitle": "Category Title",
      "catData": [
        { "value": 100, "question": "Question 1 is", "answer": "What is Answer 1" },
        { "value": 200, "question": "Question 2 is", "answer": "What is Answer 2" },
        { "value": 300, "question": "Question 3 is", "answer": "What is Answer 3" },
        { "value": 400, "question": "Question 4 is", "answer": "What is Answer 4" },
        { "value": 500, "question": "Question 5 is", "answer": "What is Answer 5" },
      ]
    }
  `
    ;
  };

  console.log(buildPrompt(text));

  console.log('++++++ BREAK AFTER BUILD PROMPT ++++++++');

  const response: OpenAIResponse = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: buildPrompt(text),
    max_tokens: 2000,
    temperature: 0.9,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0.25,
    best_of: 1,
    n: 1,
    stream: false,
  });
  
  console.log('BREAK ~~~~~~~~~~~~~~~~~~~~');

  const data = response.data.choices[0]?.text;
  console.log(data, '\nBREAK');

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const returnData: Category = JSON.parse(data);

  return returnData;
};


export const chatGPTRouter = createTRPCRouter({
  getNewCategory: publicProcedure
  .input(z.object({ text: z.string() }))
  .mutation(async ({ input }) => {
    const response = await fetchNewCategory(input.text);

    const category: Category = {
      catTitle: response.catTitle,
      catData: response.catData,
    };

    return category;
  }),
  
});

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
