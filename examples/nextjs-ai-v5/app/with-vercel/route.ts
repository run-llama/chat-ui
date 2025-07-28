import { openai } from "@ai-sdk/openai";
import {
	createUIMessageStream,
	createUIMessageStreamResponse,
	streamText,
	convertToModelMessages,
} from "ai";
import { MyUIMessage } from "./types";

export async function POST(req: Request) {
	const { messages } = await req.json();

	const stream = createUIMessageStream<MyUIMessage>({
		execute: ({ writer }) => {
			// 1. Send initial status (transient - won't be added to message history)
			writer.write({
				type: "data-notification",
				data: { message: "Processing your request...", level: "info" },
				transient: true, // This part won't be added to message history
			});

			// 2. Send sources (useful for RAG use cases)
			// data: {"type":"source-document","sourceId":"https://example.com","mediaType":"file","title":"Title"}
			writer.write({
				type: "source-document",
				sourceId: "https://example.com",
				mediaType: "file",
				title: "Title",
			});

			// 3. Send data parts with loading state
			writer.write({
				type: "data-weather",
				id: "weather-1",
				data: { city: "San Francisco", status: "loading" },
			});

			const result = streamText({
				model: openai("gpt-4.1"),
				messages: convertToModelMessages(messages),
				onFinish() {
					// 4. Update the same data part (reconciliation)
					writer.write({
						type: "data-weather",
						id: "weather-1", // Same ID = update existing part
						data: {
							city: "San Francisco",
							weather: "sunny",
							status: "success",
						},
					});

					// 5. Send completion notification (transient)
					writer.write({
						type: "data-notification",
						data: { message: "Request completed", level: "info" },
						transient: true, // Won't be added to message history
					});
				},
			});

			writer.merge(result.toUIMessageStream());
		},
	});

	return createUIMessageStreamResponse({ stream });
}
