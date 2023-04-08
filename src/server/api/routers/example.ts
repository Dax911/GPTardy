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
type NewCategoryResponse = {
  text?: object;
};

// Validation schema for response data
const newCategoryResponseSchema = z.object({
  text: z.any(),
});

interface TriviaCategory {
  title: string;
  questions: {
    value: number;
    question: string;
    answer: string;
  }[];
}

//Create a new category of questions and answers. Build the category based on the following phrase "${text}". Be sure to return the response in json format.

const fetchNewCategory = async (text: string): Promise<NewCategoryResponse> => {
  const buildPromt = (text: string) => {
    return `Create a new category of questions and answers. Build the category based on the following phrase "${text}". Be sure to return the jeopardy style response in json format. Be sure that the higher value questions are more difficult than the lower values. Like so:
    {
      title: 'Category Title',
      questions: [
        { value: 100, question: 'Question 1 is', answer: 'What is Answer 1' },
        { value: 200, question: 'Question 2 is', answer: 'What is Answer 2' },
        { value: 300, question: 'Question 3 is', answer: 'What is Answer 3' },
        { value: 400, question: 'Question 4 is', answer: 'What is Answer 4' },
        { value: 500, question: 'Question 5 is', answer: 'What is Answer 5' },
      ]
    },`
    ;
  };

  console.log(buildPromt(text));

  console.log('++++++ BREAK AFTER BUILB PROMPT ++++++++');

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: buildPromt(text),
    max_tokens: 2000,
    temperature: 0.9,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0.25,
    best_of: 1,
    n: 1,
    stream: false,
  });
  
  //console.log(response);
  console.log(response.data);
  console.log('BREAK');
  console.log(response.data.choices);
  console.log('BREAK ~~~~~~~~~~~~~~~~~~~~');


  const data = newCategoryResponseSchema.parse({
    text: response.data.choices[0]?.text,
  });

  return data;
};

export const chatGPTRouter = createTRPCRouter({
  getNewCategory: publicProcedure
  .input(z.object({ text: z.string() }))
  .query(async ({ input }) => {
    const response = await fetchNewCategory(input.text);
    console.log(response);
    return JSON.stringify(response);
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
