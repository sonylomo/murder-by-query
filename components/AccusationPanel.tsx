"use client";

import { CheckCircle, XCircle } from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

interface Suspect {
	id: number;
	name: string;
	role: string;
}

interface AccusationPanelProps {
	suspects: Suspect[];
	correctSuspectId: number;
	onAccuse: (suspectId: number) => void;
	gameOver: boolean;
	isCorrect?: boolean;
}

export function AccusationPanel({
	suspects,
	correctSuspectId,
	onAccuse,
	gameOver,
	isCorrect,
}: AccusationPanelProps) {
	const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);

	const handleAccuse = () => {
		if (selectedSuspect) {
			onAccuse(parseInt(selectedSuspect, 10));
			setSelectedSuspect(null);
		}
	};

	return (
		<Card className="h-full flex flex-col border-border/50">
			<CardHeader>
				<CardTitle>Make Your Accusation</CardTitle>
				<CardDescription>Choose who committed the crime</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col justify-between gap-4">
				{!gameOver ? (
					<>
						<div className="space-y-3">
							<label className="text-sm font-medium text-foreground">
								Select Suspect:
							</label>
							<Select
								value={selectedSuspect}
								onValueChange={setSelectedSuspect}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Choose a suspect..." />
								</SelectTrigger>
								<SelectContent>
									{suspects.map((suspect) => (
										<SelectItem key={suspect.id} value={String(suspect.id)}>
											{suspect.name} - {suspect.role}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<Button
							onClick={handleAccuse}
							disabled={!selectedSuspect}
							className="w-full"
						>
							Make Accusation
						</Button>
					</>
				) : (
					<div className="space-y-4">
						{isCorrect ? (
							<Alert className="bg-green-500/10 border-green-500/20">
								<CheckCircle className="h-5 w-5 text-green-500" />
								<AlertDescription className="text-green-600 dark:text-green-400 font-semibold">
									Congratulations! You solved the mystery! 🎉
								</AlertDescription>
							</Alert>
						) : (
							<Alert className="bg-destructive/10 border-destructive/20">
								<XCircle className="h-5 w-5 text-destructive" />
								<AlertDescription className="text-destructive">
									Incorrect! Give it another try.
									{/* Incorrect! The real culprit was{' '} */}
									{/* <span className="font-semibold">
                    {suspects.find(s => s.id === correctSuspectId)?.name}
                  </span> */}
									.
								</AlertDescription>
							</Alert>
						)}

						<div className="p-3 bg-secondary/30 rounded text-sm text-foreground border border-border/30">
							<p className="font-semibold mb-1">Your Investigation:</p>
							<ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
								<li>Executed SQL queries</li>
								<li>Examined database records</li>
								<li>Reviewed available clues</li>
							</ul>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
