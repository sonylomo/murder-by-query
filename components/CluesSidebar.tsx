'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Lock } from 'lucide-react';

interface Clue {
  id: number;
  content: string;
  category: string;
  unlockLevel: number;
}

interface CluesSidebarProps {
  clues: Clue[];
  currentLevel: number;
}

export function CluesSidebar({ clues, currentLevel }: CluesSidebarProps) {
  const unlockedClues = clues.filter(c => c.unlockLevel <= currentLevel);
  const lockedClues = clues.filter(c => c.unlockLevel > currentLevel);

  return (
    <Card className="h-full flex flex-col border-border/50">
      <CardHeader>
        <CardTitle>Investigation Clues</CardTitle>
        <CardDescription>
          Level {currentLevel} / {Math.max(...clues.map(c => c.unlockLevel))}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-4">
        {unlockedClues.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-primary">Unlocked Clues</h3>
            {unlockedClues.map((clue) => (
              <div key={clue.id} className="p-2 bg-green-500/10 border border-green-500/20 rounded text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-none">{clue.category}</Badge>
                </div>
                <p className="text-foreground text-xs leading-relaxed">{clue.content}</p>
              </div>
            ))}
          </div>
        )}

        {lockedClues.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Locked Clues</h3>
            {lockedClues.map((clue) => (
              <div key={clue.id} className="p-2 bg-muted/30 border border-border/30 rounded text-sm opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-3 h-3" />
                  <span className="text-xs text-muted-foreground">Unlock at Level {clue.unlockLevel}</span>
                </div>
                <p className="text-muted-foreground text-xs">Hidden clue</p>
              </div>
            ))}
          </div>
        )}

        {clues.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No clues available yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
