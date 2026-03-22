"use client";

import { AlertCircle, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { highlight } from "sql-highlight";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";

interface QueryEditorProps {
	onExecute: (query: string) => void;
	isLoading?: boolean;
	error?: string;
	initialQuery?: string;
}

export function QueryEditor({
	onExecute,
	isLoading,
	error,
	initialQuery,
}: QueryEditorProps) {
	const [query, setQuery] = useState(initialQuery || "SELECT * FROM suspect;");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const highlightRef = useRef<HTMLDivElement>(null);

	const updateHighlight = () => {
		if (highlightRef.current) {
			const highlightedHTML = highlight(query, { html: true });
			// Use textContent to safely set the highlighted content
			const tempDiv = document.createElement("div");
			tempDiv.innerHTML = highlightedHTML;
			highlightRef.current.innerHTML = "";
			while (tempDiv.firstChild) {
				highlightRef.current.appendChild(tempDiv.firstChild);
			}
			// Add a newline at the end
			highlightRef.current.appendChild(document.createTextNode("\n"));
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <this is intentional>
	useEffect(() => {
		updateHighlight();
	}, [query]);

	const handleExecute = () => {
		onExecute(query);
	};

	const toggleComment = () => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const val = textarea.value;

		const lineStart = val.lastIndexOf("\n", start - 1) + 1;
		let lineEnd = val.indexOf("\n", end);
		if (lineEnd === -1) lineEnd = val.length;

		const selection = val.substring(lineStart, lineEnd);
		const lines = selection.split("\n");

		const isCommented = lines.every((line) => line.trim().startsWith("--"));

		const newLines = lines.map((line) => {
			if (isCommented) {
				return line.replace(/^(\s*)--\s?/, "$1");
			}
			return `-- ${line}`;
		});

		const newSelection = newLines.join("\n");
		const newValue =
			val.substring(0, lineStart) + newSelection + val.substring(lineEnd);

		setQuery(newValue);

		setTimeout(() => {
			if (textareaRef.current) {
				textareaRef.current.focus();
				textareaRef.current.setSelectionRange(
					lineStart,
					lineStart + newSelection.length,
				);
			}
		}, 0);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
			e.preventDefault();
			handleExecute();
		}

		if ((e.ctrlKey || e.metaKey) && e.key === "/") {
			e.preventDefault();
			toggleComment();
		}
	};

	const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
		if (highlightRef.current) {
			highlightRef.current.scrollTop = e.currentTarget.scrollTop;
			highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
		}
	};

	return (
		<Card className="h-full md:h-[80vh] flex flex-col border-border/50">
			<CardHeader>
				<CardTitle>SQL Query Editor</CardTitle>
				<CardDescription>
					Write SELECT queries to investigate. Ctrl+Enter to execute.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col min-h-0 gap-4 p-6 overflow-hidden">
				<div className="flex-1 flex flex-col min-h-0 gap-4 overflow-hidden relative">
					<div className="flex-1 relative min-h-0">
						{/* Highlighting Layer */}
						<div
							ref={highlightRef}
							className="absolute inset-0 px-2.5 py-2 font-mono text-sm pointer-events-none whitespace-pre-wrap wrap-break-word overflow-auto border border-transparent bg-background/50 rounded-lg"
							aria-hidden="true"
						/>

						{/* Editing Layer */}
						<Textarea
							ref={textareaRef}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={handleKeyDown}
							onScroll={handleScroll}
							className="absolute inset-0 flex-1 font-mono text-sm resize-none bg-transparent text-transparent caret-foreground focus-visible:ring-0 focus-visible:ring-offset-0 border-border/50 overflow-auto [field-sizing:initial] min-h-0 h-full scrollbar-thin selection:bg-primary/30"
							placeholder="SELECT * FROM suspect;"
							spellCheck="false"
						/>
					</div>

					{error && (
						<Alert className="bg-destructive/10 border-destructive/20 shrink-0">
							<AlertCircle className="h-4 w-4 text-destructive" />
							<AlertDescription className="text-destructive text-sm">
								{error}
							</AlertDescription>
						</Alert>
					)}
				</div>

				<Button
					onClick={handleExecute}
					disabled={isLoading || !query.trim()}
					className="w-full gap-2"
				>
					<Play className="w-4 h-4" />
					{isLoading ? "Executing..." : "Execute Query"}
				</Button>
			</CardContent>
		</Card>
	);
}