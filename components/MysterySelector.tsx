'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Link from 'next/link';

interface Mystery {
  id: string;
  title: string;
  description: string;
  location: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hint: string;
}

const mysteries: Mystery[] = [
  {
    id: 'winchester',
    title: 'Murder at Winchester Manor',
    description: 'A wealthy estate owner has been found dead. Multiple suspects with secrets. Can you uncover the truth?',
    location: 'Winchester Manor Estate',
    difficulty: 'Medium',
    hint: 'Pay close attention to financial records and past relationships.',
  },
  {
    id: 'hidden',
    title: 'The Hidden Truth',
    description: 'An artist reports a break-in, but nothing was stolen. Something more sinister lurks beneath the surface.',
    location: 'Hart Residence Studio',
    difficulty: 'Hard',
    hint: 'Look for inconsistencies in statements and medication records.',
  },
  {
    id: 'heist',
    title: 'The Vintage Jewel Heist',
    description: 'A priceless ruby has vanished from a secure museum vault. Inside job or masterful theft?',
    location: 'Metropolitan Museum',
    difficulty: 'Easy',
    hint: 'Check who had access and what their financial situation was.',
  },
];

export function MysterySelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">🔍 Murder By Query</h1>
          <p className="text-lg text-muted-foreground">Solve mysteries inspired by thrillers with SQL queries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mysteries.map((mystery) => (
            <Card key={mystery.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{mystery.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{mystery.location}</CardDescription>
                  </div>
                  <Badge variant={
                    mystery.difficulty === 'Easy' ? 'default' :
                      mystery.difficulty === 'Medium' ? 'secondary' :
                        'destructive'
                  }>
                    {mystery.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-foreground mb-3">{mystery.description}</p>
                  <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground italic border border-border/30">
                    💡 {mystery.hint}
                  </div>
                </div>
                <Link href={`/mystery/${mystery.id}`} className="w-full mt-4">
                  <Button className="w-full">
                    Start Investigation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
