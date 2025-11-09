export type LeagueTierId = 'sprout' | 'canopy' | 'impact';

export type LeagueTier = {
  id: LeagueTierId;
  name: string;
  emoji: string;
  color: string;
  description: string;
  promotionSlots: number;
  demotionSlots: number;
  sampleOpponents: { id: string; name: string; points: number }[];
};

export const leagueTiers: Record<LeagueTierId, LeagueTier> = {
  sprout: {
    id: 'sprout',
    name: 'Sprout League',
    emoji: '🌱',
    color: '#DBF262',
    description: 'New players and weekly explorers getting started together.',
    promotionSlots: 5,
    demotionSlots: 5,
    sampleOpponents: [
      { id: 'guilda', name: 'Guilda', points: 280 },
      { id: 'sol', name: 'Solaris', points: 255 },
      { id: 'moss', name: 'MossBoss', points: 230 },
      { id: 'sprout-you', name: 'You', points: 0 },
    ],
  },
  canopy: {
    id: 'canopy',
    name: 'Canopy League',
    emoji: '🌿',
    color: '#9DF271',
    description: 'Consistent streakers who unlock tougher challenges.',
    promotionSlots: 4,
    demotionSlots: 4,
    sampleOpponents: [
      { id: 'leafy', name: 'LeafyDreamer', points: 880 },
      { id: 'flow', name: 'FlowState', points: 830 },
      { id: 'terra', name: 'TerraNova', points: 790 },
      { id: 'canopy-you', name: 'You', points: 640 },
    ],
  },
  impact: {
    id: 'impact',
    name: 'Impact League',
    emoji: '🌎',
    color: '#6EF2CB',
    description: 'Elite players with proven IRL impact.',
    promotionSlots: 3,
    demotionSlots: 3,
    sampleOpponents: [
      { id: 'impact-1', name: 'Impacto', points: 2200 },
      { id: 'impact-2', name: 'Rewild', points: 2010 },
      { id: 'impact-3', name: 'EcoSignal', points: 1940 },
      { id: 'impact-you', name: 'You', points: 1625 },
    ],
  },
};

export function getLeagueTier(id?: string | null): LeagueTier {
  if (id && id in leagueTiers) {
    return leagueTiers[id as LeagueTierId];
  }
  return leagueTiers.sprout;
}

export function generateLeagueStandings(tierId?: string | null) {
  const tier = getLeagueTier(tierId);
  return tier.sampleOpponents.map((opponent, index) => ({
    ...opponent,
    rank: index + 1,
  }));
}
