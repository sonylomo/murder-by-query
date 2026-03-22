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
		<Card className="h-[80vh] flex flex-col overflow-hidden border-border/50">
			<CardHeader className="flex-none">
				<CardTitle>Query Results</CardTitle>
				<CardDescription>{rows.length} rows returned</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col min-h-0 px-6 overflow-hidden">
				<div className="flex-1 min-h-0 overflow-auto border rounded-md shadow-inner bg-card h-full">
					<div className="relative">
						<table className="w-full text-sm border-collapse table-auto">
							<thead className="sticky top-0 z-10">
								<tr className="border-border bg-card">
									{columns.map((col) => (
										<th
											key={col}
											className="px-3 py-2 text-left font-semibold text-foreground bg-secondary border-b-2 border-border whitespace-nowrap sticky top-0 z-10"
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
												className="px-3 py-2 text-foreground max-w-xs text-wrap"
											>
												{String(row[col] ?? "")}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
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