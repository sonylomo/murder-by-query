import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";

export function NotesPanel({ mysteryId }: { mysteryId: string }) {
	const storageKey = `notes_${mysteryId}`;
	const [notes, setNotes] = useState("");
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const storedNotes = localStorage.getItem(storageKey);
		if (storedNotes) {
			setNotes(storedNotes);
		}
		setIsLoaded(true);
	}, [storageKey]);

	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem(storageKey, notes);
		}
	}, [notes, storageKey, isLoaded]);

	return (
		<Card className="border-none shadow-none bg-transparent">
			<CardHeader className="px-0">
				<CardTitle className="text-2xl flex items-center gap-2">
					<Pen className="w-6 h-6 text-primary" />
					Notes
				</CardTitle>
				<CardDescription>Review the details of your notes</CardDescription>
			</CardHeader>
			<CardContent className="px-0">
				<div className="prose prose-sm dark:prose-invert max-w-none bg-white rounded-2xl border border-border/50">
					<Textarea
						placeholder="Type your notes here..."
						className="rounded-2xl"
						onChange={(e) => setNotes(e.target.value)}
						value={notes}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
