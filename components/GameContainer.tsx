'use client';

import { useEffect, useState } from 'react';
import { QueryEditor } from './QueryEditor';
import { ResultsViewer } from './ResultsViewer';
import { SchemaViewer } from './SchemaViewer';
import { CluesSidebar } from './CluesSidebar';
import { AccusationPanel } from './AccusationPanel';
import { CaseBriefing } from './CaseBriefing';
import { Button } from './ui/button';
import { initDB, getDB, createSchema, seedWinchesterManor, seedHiddenDrawings, seedVintageHeist } from '@/lib/db';
import { validateQuery } from '@/lib/queryValidator';
import { RotateCcw, Menu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface GameContainerProps {
  mysteryId: string;
}

interface TableSchema {
  name: string;
  columns: Array<{ name: string; type: string }>;
}

interface Clue {
  id: number;
  content: string;
  category: string;
  unlockLevel: number;
}

interface Suspect {
  id: number;
  name: string;
  role: string;
}

const MYSTERY_CORRECT_SUSPECT: Record<string, number> = {
  winchester: 2, // Margaret Winchester
  hidden: 2, // James Hart
  heist: 3, // Detective James Walsh
};

const MYSTERY_TITLES: Record<string, string> = {
  winchester: 'Murder at Winchester Manor',
  hidden: 'The Hidden Truth',
  heist: 'The Vintage Jewel Heist',
};

export function GameContainer({ mysteryId }: GameContainerProps) {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [schema, setSchema] = useState<TableSchema[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [clues, setClues] = useState<Clue[]>([]);
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Initialize database and load mystery data
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        await createSchema();

        // Load mystery-specific data
        if (mysteryId === 'winchester') {
          await seedWinchesterManor();
        } else if (mysteryId === 'hidden') {
          await seedHiddenDrawings();
        } else if (mysteryId === 'heist') {
          await seedVintageHeist();
        }

        // Build schema
        const database = getDB();
        const tables: TableSchema[] = [];

        const tableNames = ['suspect', 'event', 'evidence', 'clue'];
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

        // Load clues
        const stmt = database.prepare('SELECT * FROM clue ORDER BY unlock_level');
        const clueList: Clue[] = [];
        while (stmt.step()) {
          const row = stmt.getAsObject();
          clueList.push({
            id: row.id as number,
            content: row.content as string,
            category: row.category as string,
            unlockLevel: row.unlock_level as number,
          });
        }
        stmt.free();
        setClues(clueList);

        // Load suspects
        const stmtS = database.prepare('SELECT * FROM suspect ORDER BY id');
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
        console.error('Database initialization failed:', err);
        setError('Failed to initialize game. Please refresh.');
      }
    };

    initialize();
  }, [mysteryId]);

  const handleExecuteQuery = async (query: string) => {
    setError('');
    setResults([]);
    setColumns([]);

    // Validate query
    const validation = validateQuery(query);
    if (!validation.valid) {
      setError(validation.error || 'Invalid query');
      return;
    }

    try {
      setIsLoading(true);
      const database = getDB();

      // Execute query
      const stmt = database.prepare(query);
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
      setQueryCount(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || 'Query execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccuse = (suspectId: number) => {
    const correct = suspectId === MYSTERY_CORRECT_SUSPECT[mysteryId];
    setIsCorrect(correct);
    setGameOver(true);
  };

  const handleReset = async () => {
    setResults([]);
    setColumns([]);
    setError('');
    setQueryCount(0);
    setGameOver(false);
    setIsCorrect(false);
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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{MYSTERY_TITLES[mysteryId]}</h1>
            <p className="text-sm text-muted-foreground">Queries: {queryCount} | Investigation Level: {currentLevel}</p>
          </div>
          <div className="flex gap-2 text-primary">
            {gameOver && (
              <Button onClick={handleReset} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>
            )}
            <Button
              onClick={() => setShowSidebar(!showSidebar)}
              variant="outline"
              size="icon"
              className="md:hidden"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Mysteries
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex gap-4 p-4">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Case Briefing */}
          <div className="max-h-24">
            <CaseBriefing mysteryId={mysteryId} />
          </div>

          {/* Editor and Results */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <QueryEditor
              onExecute={handleExecuteQuery}
              isLoading={isLoading}
              error={error}
            />
            <ResultsViewer
              rows={results}
              columns={columns}
              isLoading={isLoading}
            />
          </div>

          {/* Schema Viewer */}
          <div className="h-56 min-h-0">
            <SchemaViewer schema={schema} />
          </div>
        </div>

        {/* Right Sidebar */}
        {showSidebar && (
          <div className="w-80 flex flex-col gap-4 hidden md:flex">
            <div className="flex-1 min-h-0 overflow-hidden">
              <CluesSidebar clues={clues} currentLevel={currentLevel} />
            </div>
            <div className="h-80 min-h-0">
              <AccusationPanel
                suspects={suspects}
                correctSuspectId={MYSTERY_CORRECT_SUSPECT[mysteryId]}
                onAccuse={handleAccuse}
                gameOver={gameOver}
                isCorrect={isCorrect}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Clues and Accusation */}
      {!showSidebar && (
        <div className="md:hidden border-t border-border p-4 max-h-96 overflow-y-auto space-y-4">
          <CluesSidebar clues={clues} currentLevel={currentLevel} />
          <AccusationPanel
            suspects={suspects}
            correctSuspectId={MYSTERY_CORRECT_SUSPECT[mysteryId]}
            onAccuse={handleAccuse}
            gameOver={gameOver}
            isCorrect={isCorrect}
          />
        </div>
      )}
    </div>
  );
}
