'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import { AlertCircle, Play } from 'lucide-react';

interface QueryEditorProps {
  onExecute: (query: string) => void;
  isLoading?: boolean;
  error?: string;
}

export function QueryEditor({ onExecute, isLoading, error }: QueryEditorProps) {
  const [query, setQuery] = useState('SELECT * FROM suspect;');

  const handleExecute = () => {
    onExecute(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleExecute();
    }
  };

  return (
    <Card className="h-full flex flex-col border-border/50">
      <CardHeader>
        <CardTitle>SQL Query Editor</CardTitle>
        <CardDescription>Write SELECT queries to investigate. Ctrl+Enter to execute.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 font-mono text-sm resize-none bg-background/50"
          placeholder="SELECT * FROM suspect WHERE role = 'Architect';"
          spellCheck="false"
        />

        {error && (
          <Alert className="bg-destructive/10 border-destructive/20">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleExecute}
          disabled={isLoading || !query.trim()}
          className="w-full gap-2"
        >
          <Play className="w-4 h-4" />
          {isLoading ? 'Executing...' : 'Execute Query'}
        </Button>
      </CardContent>
    </Card>
  );
}
