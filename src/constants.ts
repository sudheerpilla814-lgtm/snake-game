export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  genre: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'CyberGen',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Sample mp3
    duration: 372,
    genre: 'Synthwave'
  },
  {
    id: '2',
    title: 'Neural Drift',
    artist: 'AI Oracle',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 425,
    genre: 'Ambient'
  },
  {
    id: '3',
    title: 'Glitch Horizon',
    artist: 'Binary Soul',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 310,
    genre: 'Cyberpunk'
  }
];
