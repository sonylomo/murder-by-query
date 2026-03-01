'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TableSchema {
  name: string;
  columns: Array<{
    name: string;
    type: string;
  }>;
}

interface SchemaViewerProps {
  schema: TableSchema[];
}

export function SchemaViewer({ schema }: SchemaViewerProps) {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set(schema.map(t => t.name)));

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  return (
    <Card className="h-full flex flex-col border-border/50">
      <CardHeader>
        <CardTitle>Database Schema</CardTitle>
        <CardDescription>Available tables and columns</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-2">
        {schema.map((table) => (
          <div key={table.name} className="border border-border/50 rounded-md overflow-hidden">
            <button
              onClick={() => toggleTable(table.name)}
              className="w-full px-3 py-2 bg-secondary/50 hover:bg-secondary/70 text-foreground font-semibold text-sm flex items-center justify-between transition-colors"
            >
              <span className="font-mono">{table.name}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${expandedTables.has(table.name) ? '' : '-rotate-90'}`}
              />
            </button>

            {expandedTables.has(table.name) && (
              <div className="px-3 py-2 bg-background space-y-1">
                {table.columns.map((col) => (
                  <div key={`${table.name}-${col.name}`} className="text-sm text-foreground">
                    <span className="font-mono font-semibold text-primary">{col.name}</span>
                    <span className="text-muted-foreground ml-2">({col.type})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
