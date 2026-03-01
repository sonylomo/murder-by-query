'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface CaseBriefingProps {
  mysteryId: string;
}

const BRIEFINGS: Record<string, { title: string; brief: string }> = {
  winchester: {
    title: 'Murder at Winchester Manor',
    brief: 'A prestigious estate has been thrown into chaos following the sudden death of its owner. The victim was found in the library late evening. Five individuals had access to the estate that day, each with potential motives and suspicious behavior.',
  },
  hidden: {
    title: 'The Hidden Truth',
    brief: 'An artist\'s home was allegedly broken into, yet no obvious theft occurred. Instead, her artwork was damaged and she was found unconscious hours later. Inconsistencies in the story suggest something more sinister may have been orchestrated.',
  },
  heist: {
    title: 'The Vintage Jewel Heist',
    brief: 'A rare and priceless ruby has vanished from the most secure museum vault. Security footage was corrupted at a critical moment. Multiple suspects had access and expertise, but who orchestrated this heist?',
  },
};

export function CaseBriefing({ mysteryId }: CaseBriefingProps) {
  const briefing = BRIEFINGS[mysteryId] || BRIEFINGS.winchester;

  return (
    <Card className="max-h-24 overflow-auto border-border/50">
      <CardHeader>
        <CardTitle>{briefing.title}</CardTitle>
        <CardDescription>Case Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground leading-relaxed">{briefing.brief}</p>
      </CardContent>
    </Card>
  );
}
