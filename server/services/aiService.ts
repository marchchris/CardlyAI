import OpenAI from 'openai';
import { Card } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates flashcards from the provided content using OpenAI's API
 * @param content - The study material to generate flashcards from
 * @param numCards - The number of flashcards to generate
 * @returns Array of cards with questions and answers
 */
export async function generateFlashcards(content: string, numCards: number): Promise<Card[]> {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an educational assistant that creates high-quality flashcards from study content."
                },
                {
                    role: "user",
                    content: `Create ${numCards} flashcards based on this content: ${content}`
                }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "deck_schema",
                    schema: {
                        type: "object",
                        properties: {
                            flashcards: {
                                type: "array",
                                description: `An array of exactly ${numCards} flashcards based on the provided study content`,
                                items: {
                                    type: "object",
                                    properties: {
                                        question: {
                                            type: "string",
                                            description: "A clear, concise question about a key concept in the content"
                                        },
                                        answer: {
                                            type: "string",
                                            description: "A comprehensive yet concise answer to the question"
                                        }
                                    },
                                    required: ["question", "answer"]
                                }
                            }
                        },
                        required: ["flashcards"]
                    }
                }
            },
        });

        // Extract the flashcards from the response
        const responseText = completion.choices[0].message.content;
        if (!responseText) {
            throw new Error("Empty response from OpenAI");
        }

        const parsedResponse = JSON.parse(responseText);
        const cards: Card[] = parsedResponse.flashcards.map((card: any) => ({
            question: card.question,
            answer: card.answer
        })).slice(0, numCards);

        return cards;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error generating flashcards:", error);
            throw new Error(`Failed to generate flashcards: ${error.message}`);
        } else {
            console.error("Error generating flashcards:", error);
            throw new Error("Failed to generate flashcards: Unknown error");
        }
    }
}
