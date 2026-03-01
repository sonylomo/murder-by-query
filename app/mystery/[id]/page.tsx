'use client';

import { use } from 'react';
import { GameContainer } from '@/components/GameContainer';

export default function MysteryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <main>
            <GameContainer mysteryId={id} />
        </main>
    );
}
