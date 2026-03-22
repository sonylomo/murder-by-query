"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

interface ResultsViewerProps {
	// biome-ignore lint/suspicious/noExplicitAny: <sql.js returns any>
	rows: any[];
	columns: string[];
	isLoading?: boolean;
}

export function ResultsViewer({
	rows,
	columns,
	isLoading,
}: ResultsViewerProps) {
	if (isLoading) {
		return (
			<Card className="h-full flex flex-col">
				<CardHeader>
					<CardTitle>Query Results</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 flex items-center justify-center">
					<div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
				</CardContent>
			</Card>
		);
	}

	if (columns.length === 0) {
		return (
			<Card className="h-full flex flex-col">
				<CardHeader>
					<CardTitle>Query Results</CardTitle>
					<CardDescription>Execute a query to see results</CardDescription>
				</CardHeader>
				<CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
					No results yet
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="h-full flex flex-col">
			<CardHeader>
				<CardTitle>Query Results</CardTitle>
				<CardDescription>{rows.length} rows returned</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 overflow-auto">
				<div className="overflow-x-auto">
					<table className="w-full text-sm border-collapse">
						<thead>
							<tr className="border-b-2 border-border">
								{columns.map((col) => (
									<th
										key={col}
										className="px-3 py-2 text-left font-semibold text-foreground bg-secondary"
									>
										{col}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{rows.map((row, idx) => (
								<tr
									key={idx}
									className="border-b border-border hover:bg-secondary/50"
								>
									{columns.map((col) => (
										<td
											key={`${idx}-${col}`}
											className="px-3 py-2 text-foreground max-w-xs truncate"
										>
											{String(row[col] ?? "")}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{rows.length === 0 && (
					<div className="py-8 text-center text-muted-foreground">
						No data matched your query
					</div>
				)}
			</CardContent>
		</Card>
	);
}
