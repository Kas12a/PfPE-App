export type QuestCategory = 'Nature' | 'Energy' | 'Movement' | 'Waste' | 'Community';
export type QuestEvidenceType = 'photo' | 'video' | 'check';

export type QuestDefinition = {
  id: string;
  title: string;
  subtitle: string;
  instructions: string;
  points: number;
  impact: string;
  category: QuestCategory;
  type: QuestEvidenceType;
  due?: string;
  requiresEvidenceLabel?: string;
};

export const dailyQuests: QuestDefinition[] = [
  {
    id: 'community-garden',
    title: 'Visit a community garden',
    subtitle: 'Share a moment from today’s visit',
    instructions: 'Snap a photo showing the plot or plants you tended to prove you were there.',
    points: 35,
    impact: 'Connect with local growers to nurture biodiversity.',
    category: 'Community',
    type: 'photo',
    due: 'Today',
    requiresEvidenceLabel: 'Add garden photo',
  },
  {
    id: 'plastic-audit',
    title: 'Plastic-free lunch audit',
    subtitle: 'Record a short clip of your plastic-free lunch prep',
    instructions: 'Upload a 10–20 second video highlighting the reusable items you chose.',
    points: 40,
    impact: 'Helps the community learn new low-waste tips.',
    category: 'Waste',
    type: 'video',
    due: 'Today',
    requiresEvidenceLabel: 'Upload lunch video',
  },
  {
    id: 'walk-meetings',
    title: 'Host a walking meeting',
    subtitle: 'Just check once you’re back',
    instructions: 'Switch one meeting to audio-only while you walk outdoors.',
    points: 20,
    impact: 'Swapping a car trip for human power saves CO₂.',
    category: 'Movement',
    type: 'check',
    due: 'Today',
  },
  {
    id: 'lights-out',
    title: 'Lights-off hour',
    subtitle: 'Power down non-essential lights',
    instructions: 'Turn everything off for 60 minutes and share a quick snap if you can.',
    points: 15,
    impact: 'Reducing evening usage eases the grid.',
    category: 'Energy',
    type: 'photo',
    due: 'Tonight',
    requiresEvidenceLabel: 'Add lights-out photo',
  },
];

export const evergreenQuests: QuestDefinition[] = [
  {
    id: 'refill-station',
    title: 'Refill station stop',
    subtitle: 'Log each time you refill instead of buying new',
    instructions: 'Take a quick photo of the refill station or bottle.',
    points: 25,
    impact: 'Cuts down on single-use plastics every visit.',
    category: 'Waste',
    type: 'photo',
  },
  {
    id: 'train-swap',
    title: 'Swap a drive for public transit',
    subtitle: 'Metro, bus, or tram — they all count',
    instructions: 'Mark complete once you arrive. Bonus photo if you can!',
    points: 30,
    impact: 'Shared transport drastically lowers per-person emissions.',
    category: 'Movement',
    type: 'check',
  },
  {
    id: 'energy-audit',
    title: 'Mini home energy audit',
    subtitle: 'Track the top 3 appliances you can turn off',
    instructions: 'Record a quick 15s video tour or upload a still of your checklist.',
    points: 45,
    impact: 'Awareness unlocks long-term savings for your household.',
    category: 'Energy',
    type: 'video',
    requiresEvidenceLabel: 'Upload audit video',
  },
];

export const questFilters: QuestCategory[] = ['Nature', 'Energy', 'Movement', 'Waste', 'Community'];
