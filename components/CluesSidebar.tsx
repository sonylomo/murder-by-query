'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Lock, Search, Key } from 'lucide-react';
import { Clue } from '@/lib/mysteryData';

interface CluesSidebarProps {
  clues: Clue[];
  currentLevel: number;
}

export function CluesSidebar({ clues, currentLevel }: CluesSidebarProps) {
  const unlockedClues = clues.filter(c => c.unlockLevel <= currentLevel);
  const lockedClues = clues.filter(c => c.unlockLevel > currentLevel);

  return (
    <Card className="h-full flex flex-col border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-xl flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Investigation Hints
        </CardTitle>
        <CardDescription>
          Level {currentLevel} Investigation
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto space-y-6 px-0 pb-0">
        {unlockedClues.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">Unlocked Leads</h3>
            {unlockedClues.map((clue) => (
              <ClueItem key={clue.id} clue={clue} />
            ))}
          </div>
        )}

        {lockedClues.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Future Leads</h3>
            {lockedClues.map((clue) => (
              <div key={clue.id} className="p-4 bg-muted/20 border border-dashed border-border/50 rounded-xl opacity-60">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-medium">Unlock after {clue.unlockLevel} queries</span>
                </div>
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

function ClueItem({ clue }: { clue: Clue }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="p-4 bg-muted/40 border border-border/50 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{clue.category}</Badge>
      </div>

      {revealed ? (
        <p className="text-foreground text-sm leading-relaxed font-medium animate-in fade-in duration-500">{clue.hint}</p>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-2 bg-background border border-dashed border-border rounded-lg text-xs text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
        >
          Reveal Lead Hint
        </button>
      )}

      <div className="pt-2 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground uppercase mb-2 flex items-center gap-1">
          <Key className="w-3 h-3" /> Recommended Keywords
        </p>
        <div className="flex flex-wrap gap-1.5">
          {clue.queryKeywords.map(kw => (
            <code key={kw} className="px-1.5 py-0.5 bg-background border border-border rounded text-[11px] font-mono text-primary">
              {kw}
            </code>
          ))}
        </div>
      </div>
    </div>
  );
}
