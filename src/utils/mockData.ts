
export interface Play {
  id: string;
  tags: string[];
  description: string;
  source: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  videoUrl?: string;
}

export const mockPlays: Play[] = [
  {
    id: '1',
    tags: ['Trips Right', 'Play Action Boot', 'Red Zone'],
    description: 'Beautiful play action bootleg with a perfectly timed back shoulder throw to the tight end in the red zone.',
    source: 'Hudl',
    likes: 24,
    liked: false,
    saved: false,
  },
  {
    id: '2',
    tags: ['I-Formation', 'Power Run', 'Short Yardage'],
    description: 'Classic power run with pulling guard and fullback lead. Perfect execution for short yardage situations.',
    source: 'Instagram',
    likes: 18,
    liked: false,
    saved: false,
  },
  {
    id: '3',
    tags: ['Spread', 'Screen Pass', 'Bubble Route'],
    description: 'Quick bubble screen to the slot receiver with great blocking from the outside receivers.',
    source: 'Twitter',
    likes: 31,
    liked: false,
    saved: false,
  },
  {
    id: '4',
    tags: ['Shotgun', 'Deep Ball', 'Post Route'],
    description: 'Perfect deep post route with safety beaten over the top. Quarterback drops a dime in stride.',
    source: 'Hudl',
    likes: 45,
    liked: false,
    saved: false,
  },
  {
    id: '5',
    tags: ['Wildcat', 'Direct Snap', 'Option Run'],
    description: 'Wildcat formation with direct snap to running back. Great read option with the defensive end.',
    source: 'Instagram',
    likes: 22,
    liked: false,
    saved: false,
  },
  {
    id: '6',
    tags: ['Empty Set', 'Four Verticals', 'Hot Route'],
    description: 'Four vertical routes from empty set. Quarterback finds the open receiver over the middle.',
    source: 'Twitter',
    likes: 38,
    liked: false,
    saved: false,
  },
];
