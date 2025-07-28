"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { MyUIMessage } from "./types";

export default function Chat() {
	const [input, setInput] = useState("");

	const { messages, sendMessage } = useChat<MyUIMessage>({
		onData: (dataPart) => {
			// Handle transient notifications
			if (dataPart.type === "data-notification") {
				console.log("Notification:", dataPart.data.message);
			}
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		sendMessage({ text: input });
		setInput("");
	};

	console.log("Messages:", messages);

	return (
		<>
			{messages?.map((message) => (
				<div key={message.id}>
					{message.role === "user" ? "User: " : "AI: "}

					{/* Render weather data */}
					{message.parts
						.filter((part) => part.type === "data-weather")
						.map((part, index) => (
							<span key={index} className="weather-update">
								{part.data.status === "loading" ? (
									<>Getting weather for {part.data.city}...</>
								) : (
									<>
										Weather in {part.data.city}: {part.data.weather}
									</>
								)}
							</span>
						))}

					{/* Render text content */}
					{message.parts
						.filter((part) => part.type === "text")
						.map((part, index) => (
							<div key={index}>{part.text}</div>
						))}
				</div>
			))}

			<form onSubmit={handleSubmit}>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Ask about the weather..."
				/>
				<button type="submit">Send</button>
			</form>
		</>
	);
}
