"use client";

import { AlertCircle, Play } from "lucide-react";
import { useState } from "react";
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

	const handleExecute = () => {
		onExecute(query);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
			handleExecute();
		}
	};

	return (
		<Card className="h-[80vh] flex flex-col border-border/50">
			<CardHeader>
				<CardTitle>SQL Query Editor</CardTitle>
				<CardDescription>
					Write SELECT queries to investigate. Ctrl+Enter to execute.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col min-h-0 gap-4 p-6 overflow-hidden">
				<div className="flex-1 flex flex-col min-h-0 gap-4 overflow-hidden">
					<Textarea
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={handleKeyDown}
						className="flex-1 font-mono text-sm resize-none bg-background/50 overflow-y-auto [field-sizing:initial] min-h-0 h-full"
						placeholder="SELECT * FROM suspect;"
						spellCheck="false"
					/>

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
