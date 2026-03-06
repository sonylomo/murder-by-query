import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { MYSTERY_DATA } from '@/lib/mysteryData';
import { BookOpen } from 'lucide-react';

interface CaseBriefingProps {
  mysteryId: string;
}

export function CaseBriefing({ mysteryId }: CaseBriefingProps) {
  const mystery = MYSTERY_DATA[mysteryId] || MYSTERY_DATA.winchester;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          Case Briefing
        </CardTitle>
        <CardDescription>Review the details of {mystery.title}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-base text-foreground leading-relaxed bg-muted/30 p-6 rounded-2xl border border-border/50">
            {mystery.brief}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
