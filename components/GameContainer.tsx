"use client";

import {
	ArrowLeft,
	BookOpen,
	Code2,
	Columns,
	Database,
	HelpCircle,
	RotateCcw,
	Send,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	createSchema,
	getDB,
	initDB,
	seedHiddenDrawings,
	seedVintageHeist,
	seedWinchesterManor,
} from "@/lib/db";
import { MYSTERY_DATA } from "@/lib/mysteryData";
import { validateQuery } from "@/lib/queryValidator";
import { AccusationPanel } from "./AccusationPanel";
import { CaseBriefing } from "./CaseBriefing";
import { CluesSidebar } from "./CluesSidebar";
import { NotesPanel } from "./NotesPanel";
import { QueryEditor } from "./QueryEditor";
import { ResultsViewer } from "./ResultsViewer";
import { SchemaViewer } from "./SchemaViewer";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface GameContainerProps {
	mysteryId: string;
}

interface TableSchema {
	name: string;
	columns: Array<{ name: string; type: string }>;
}

interface Suspect {
	id: number;
	name: string;
	role: string;
}

export function GameContainer({ mysteryId }: GameContainerProps) {
	const [dbInitialized, setDbInitialized] = useState(false);
	const [schema, setSchema] = useState<TableSchema[]>([]);
	// biome-ignore lint/suspicious/noExplicitAny: <sql.js returns any>
	const [results, setResults] = useState<any[]>([]);
	const [columns, setColumns] = useState<string[]>([]);
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [queryCount, setQueryCount] = useState(0);
	const [suspects, setSuspects] = useState<Suspect[]>([]);
	const [gameOver, setGameOver] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [showSchemaSidebar, setShowSchemaSidebar] = useState(true);
	const [activeTab, setActiveTab] = useState("briefing");
	const [currentQuery, setCurrentQuery] = useState("");

	const mystery = MYSTERY_DATA[mysteryId] || MYSTERY_DATA.winchester;

	useEffect(() => {
		const savedState = localStorage.getItem(`sql_editor_${mysteryId}`);
		if (savedState) {
			try {
				const state = JSON.parse(savedState);
				setQueryCount(state.queryCount || 0);
				setActiveTab(state.activeTab || "briefing");
				setCurrentQuery(state.currentQuery || "");
			} catch (err) {
				console.error("Failed to load saved state:", err);
			}
		}
	}, [mysteryId]);

	useEffect(() => {
		const stateToSave = {
			queryCount,
			activeTab,
			currentQuery,
			lastUpdated: new Date().toISOString(),
		};
		localStorage.setItem(
			`sql_editor_${mysteryId}`,
			JSON.stringify(stateToSave),
		);
	}, [queryCount, activeTab, currentQuery, mysteryId]);

	// Initialize database and load mystery data
	useEffect(() => {
		const initialize = async () => {
			try {
				await initDB();
				await createSchema();

				// Load mystery-specific data
				if (mysteryId === "winchester") {
					await seedWinchesterManor();
				} else if (mysteryId === "hidden") {
					await seedHiddenDrawings();
				} else if (mysteryId === "heist") {
					await seedVintageHeist();
				}

				// Build schema
				const database = getDB();
				const tables: TableSchema[] = [];

				const tableNames = ["suspect", "event", "evidence"];
				for (const tableName of tableNames) {
					const stmt = database.prepare(`PRAGMA table_info(${tableName})`);
					const cols: Array<{ name: string; type: string }> = [];
					while (stmt.step()) {
						const row = stmt.getAsObject();
						cols.push({
							name: row.name as string,
							type: row.type as string,
						});
					}
					stmt.free();
					tables.push({ name: tableName, columns: cols });
				}

				setSchema(tables);

				// Load suspects from DB
				const stmtS = database.prepare("SELECT * FROM suspect ORDER BY id");
				const suspectList: Suspect[] = [];
				while (stmtS.step()) {
					const row = stmtS.getAsObject();
					suspectList.push({
						id: row.id as number,
						name: row.name as string,
						role: row.role as string,
					});
				}
				stmtS.free();
				setSuspects(suspectList);

				setDbInitialized(true);
			} catch (err) {
				console.error("Database initialization failed:", err);
				setError("Failed to initialize game. Please refresh.");
			}
		};

		initialize();
	}, [mysteryId]);

	const handleExecuteQuery = async (query: string) => {
		setError("");
		setResults([]);
		setColumns([]);
		setCurrentQuery(query);

		// Validate query
		const validation = validateQuery(query);
		if (!validation.valid) {
			setError(validation.error || "Invalid query");
			return;
		}

		try {
			setIsLoading(true);
			const database = getDB();

			// Execute query
			const stmt = database.prepare(query);
			// biome-ignore lint/suspicious/noExplicitAny: <sql.js returns any>
			const rowList: any[] = [];
			const cols: string[] = [];

			let firstRow = true;
			while (stmt.step()) {
				const row = stmt.getAsObject();
				if (firstRow) {
					cols.push(...Object.keys(row));
					firstRow = false;
				}
				rowList.push(row);
			}
			stmt.free();

			setColumns(cols);
			setResults(rowList);
			setQueryCount((prev) => prev + 1);
			// biome-ignore lint/suspicious/noExplicitAny: <sql.js returns any>
		} catch (err: any) {
			setError(err.message || "Query execution failed");
		} finally {
			setIsLoading(false);
		}
	};

	const handleAccuse = (suspectId: number) => {
		const correct = suspectId === mystery.correctSuspectId;
		setIsCorrect(correct);
		setGameOver(true);
	};

	const handleReset = async () => {
		setResults([]);
		setColumns([]);
		setError("");
		setQueryCount(0);
		setGameOver(false);
		setIsCorrect(false);
		setCurrentQuery("");

		// Clear saved state for this mystery
		localStorage.removeItem(`sql_editor_${mysteryId}`);
	};

	const currentLevel = Math.floor(queryCount / 3);

	if (!dbInitialized) {
		return (
			<div className="h-screen flex items-center justify-center bg-background">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
					<p className="text-foreground">Loading mystery...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen flex flex-col bg-background overflow-hidden">
			{/* Header */}
			<header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-20">
				<div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link href="/">
							<Button variant="ghost" size="icon" className="rounded-full">
								<ArrowLeft className="w-5 h-5" />
							</Button>
						</Link>
						<div>
							<h1 className="text-xl font-bold text-foreground tracking-tight">
								{mystery.title}
							</h1>
							<div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
								<span className="flex items-center gap-1">
									<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
									Queries: {queryCount}
								</span>
								<span>•</span>
								<span>Case Level: {currentLevel}</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Button
							variant={showSchemaSidebar ? "secondary" : "ghost"}
							size="sm"
							onClick={() => setShowSchemaSidebar(!showSchemaSidebar)}
							className="hidden lg:flex gap-2"
						>
							<Columns className="w-4 h-4" />
							{showSchemaSidebar ? "Hide Sidebar" : "Show Sidebar"}
						</Button>
						{gameOver && (
							<Button
								onClick={handleReset}
								variant="destructive"
								size="sm"
								className="gap-2"
							>
								<RotateCcw className="w-4 h-4" />
								Restart Case
							</Button>
						)}
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="flex-1 flex overflow-hidden">
				{/* Sidebar Schema (Persistent Option) */}
				{showSchemaSidebar && (
					<aside className="w-72 border-r border-border bg-muted/20 hidden lg:flex flex-col animate-in slide-in-from-left duration-300">
						<div className="p-4 border-b border-border bg-card/30 flex items-center justify-between">
							<h2 className="text-sm font-semibold flex items-center gap-2">
								<Database className="w-4 h-4 text-primary" />
								Database Schema
							</h2>
						</div>
						<div className="flex-1 overflow-auto p-4">
							<SchemaViewer schema={schema} />
						</div>
					</aside>
				)}

				{/* Tabbed Content Area */}
				<main className="flex-1 flex flex-col min-w-0 bg-background/50">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex-1 flex flex-col"
					>
						<div className="px-6 pt-4 border-b border-border bg-card/30">
							<TabsList className="p-1 mb-2 gap-2 bg-muted">
								<TabsTrigger
									value="briefing"
									className={`gap-2 hover:text-accent-foreground ${activeTab === "briefing" ? " bg-white shadow-2xl border" : "bg-muted/20"}`}
								>
									<BookOpen className="w-4 h-4" />
									Case Overview
								</TabsTrigger>
								<TabsTrigger
									value="editor"
									className={`gap-2 hover:text-accent-foreground ${activeTab === "editor" ? " bg-white shadow-2xl border" : " bg-muted/20"}`}
								>
									<Code2 className="w-4 h-4" />
									SQL Editor
								</TabsTrigger>
								<TabsTrigger
									value="schema"
									className={`lg:hidden gap-2 hover:text-accent-foreground ${activeTab === "schema" ? " bg-white shadow-2xl border" : " bg-muted/20"}`}
								>
									<Database className="w-4 h-4" />
									Schema
								</TabsTrigger>
								<TabsTrigger
									value="notes"
									className={`gap-2 hover:text-accent-foreground ${activeTab === "notes" ? " bg-white shadow-2xl border" : " bg-muted/20"}`}
								>
									<BookOpen className="w-4 h-4" />
									Notes
								</TabsTrigger>
								<TabsTrigger
									value="submission"
									className={`gap-2 hover:text-accent-foreground ${activeTab === "submission" ? " bg-white shadow-2xl border" : " bg-muted/20"}`}
								>
									<Send className="w-4 h-4" />
									Submission
								</TabsTrigger>
								<TabsTrigger
									value="clues"
									className={`gap-2 hover:text-accent-foreground ${activeTab === "clues" ? " bg-white shadow-2xl border" : " bg-muted/20"}`}
								>
									<HelpCircle className="w-4 h-4" />
									Clues
								</TabsTrigger>
							</TabsList>
						</div>

						<div className="flex-1 overflow-hidden">
							<TabsContent
								value="briefing"
								className="h-full p-6 m-0 outline-none"
							>
								<div className="max-w-4xl mx-auto h-full overflow-auto">
									<CaseBriefing mysteryId={mysteryId} />
								</div>
							</TabsContent>

							<TabsContent
								value="editor"
								className="h-full p-4 m-0 outline-none"
							>
								<div className="h-screen grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-4 overflow-y-auto">
									<QueryEditor
										onExecute={handleExecuteQuery}
										isLoading={isLoading}
										error={error}
										initialQuery={currentQuery}
									/>
									<ResultsViewer
										rows={results}
										columns={columns}
										isLoading={isLoading}
									/>
								</div>
							</TabsContent>

							<TabsContent
								value="notes"
								className="h-full p-6 m-0 outline-none"
							>
								<div className="max-w-4xl mx-auto h-full overflow-auto">
									<NotesPanel />
								</div>
							</TabsContent>

							<TabsContent
								value="schema"
								className="h-full p-6 m-0 outline-none lg:hidden"
							>
								<div className="max-w-4xl mx-auto h-full overflow-auto">
									<SchemaViewer schema={schema} />
								</div>
							</TabsContent>

							<TabsContent
								value="submission"
								className="h-full p-6 m-0 outline-none"
							>
								<div className="max-w-2xl mx-auto h-full">
									<AccusationPanel
										suspects={suspects}
										correctSuspectId={mystery.correctSuspectId}
										onAccuse={handleAccuse}
										gameOver={gameOver}
										isCorrect={isCorrect}
									/>
								</div>
							</TabsContent>

							<TabsContent
								value="clues"
								className="h-full p-6 m-0 outline-none"
							>
								<div className="max-w-2xl mx-auto h-full">
									<CluesSidebar
										clues={mystery.clues}
										currentLevel={currentLevel}
									/>
								</div>
							</TabsContent>
						</div>
					</Tabs>
				</main>
			</div>
		</div>
	);
}
