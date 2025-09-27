// Auto-generated Steam Awards Types
// Generated on: 2025-09-26T04:42:13.662Z

export interface SteamAward {
    id: number;
    name: string;
    category: 'positive' | 'funny' | 'creative' | 'helpful' | 'neutral';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    staticUrl: string;
    animatedUrl: string;
    animationWeight: number;
    floatSpeed: 'slow' | 'medium' | 'fast';
    size: 'small' | 'medium' | 'large';
}

export interface SteamAwardsConfig {
    timestamp: string;
    version: string;
    awards: Record<number, SteamAward>;
    categories: Record<string, number[]>;
    rarities: Record<string, number[]>;
    floating: {
        light: number[];
        colorful: number[];
        special: number[];
    };
}

// Export the configuration
export const STEAM_AWARDS_CONFIG: SteamAwardsConfig = {
  "timestamp": "2025-09-26T04:42:13.662Z",
  "version": "2.0.0",
  "awards": {
    "1": {
      "id": 1,
      "name": "Deep Thoughts",
      "category": "positive",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/1.png",
      "animatedUrl": "/steam-awards/animated/1.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "2": {
      "id": 2,
      "name": "Hilarious",
      "category": "funny",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/2.png",
      "animatedUrl": "/steam-awards/animated/2.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "3": {
      "id": 3,
      "name": "Hot Take",
      "category": "neutral",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/3.png",
      "animatedUrl": "/steam-awards/animated/3.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "4": {
      "id": 4,
      "name": "Gotta Have It",
      "category": "positive",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/4.png",
      "animatedUrl": "/steam-awards/animated/4.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "5": {
      "id": 5,
      "name": "Poetry",
      "category": "creative",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/5.png",
      "animatedUrl": "/steam-awards/animated/5.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "6": {
      "id": 6,
      "name": "Extra Helpful",
      "category": "helpful",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/6.png",
      "animatedUrl": "/steam-awards/animated/6.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "7": {
      "id": 7,
      "name": "Michelangelo",
      "category": "creative",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/7.png",
      "animatedUrl": "/steam-awards/animated/7.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "8": {
      "id": 8,
      "name": "Wholesome",
      "category": "positive",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/8.png",
      "animatedUrl": "/steam-awards/animated/8.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "9": {
      "id": 9,
      "name": "Treasure",
      "category": "positive",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/9.png",
      "animatedUrl": "/steam-awards/animated/9.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "10": {
      "id": 10,
      "name": "Mind Blown",
      "category": "positive",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/10.png",
      "animatedUrl": "/steam-awards/animated/10.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "11": {
      "id": 11,
      "name": "Golden Unicorn",
      "category": "positive",
      "rarity": "epic",
      "staticUrl": "/steam-awards/static/11.png",
      "animatedUrl": "/steam-awards/animated/11.png",
      "animationWeight": 2,
      "floatSpeed": "medium",
      "size": "medium"
    },
    "12": {
      "id": 12,
      "name": "Mad Scientist",
      "category": "helpful",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/12.png",
      "animatedUrl": "/steam-awards/animated/12.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "13": {
      "id": 13,
      "name": "Clever",
      "category": "positive",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/13.png",
      "animatedUrl": "/steam-awards/animated/13.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "14": {
      "id": 14,
      "name": "Warm Blanket",
      "category": "positive",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/14.png",
      "animatedUrl": "/steam-awards/animated/14.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "15": {
      "id": 15,
      "name": "Saucy",
      "category": "funny",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/15.png",
      "animatedUrl": "/steam-awards/animated/15.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "16": {
      "id": 16,
      "name": "Slow Clap",
      "category": "funny",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/16.png",
      "animatedUrl": "/steam-awards/animated/16.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "17": {
      "id": 17,
      "name": "Take My Points",
      "category": "positive",
      "rarity": "legendary",
      "staticUrl": "/steam-awards/static/17.png",
      "animatedUrl": "/steam-awards/animated/17.png",
      "animationWeight": 1,
      "floatSpeed": "slow",
      "size": "large"
    },
    "18": {
      "id": 18,
      "name": "Wild",
      "category": "funny",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/18.png",
      "animatedUrl": "/steam-awards/animated/18.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "19": {
      "id": 19,
      "name": "Jester",
      "category": "funny",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/19.png",
      "animatedUrl": "/steam-awards/animated/19.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "20": {
      "id": 20,
      "name": "Fancy Pants",
      "category": "positive",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/20.png",
      "animatedUrl": "/steam-awards/animated/20.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "21": {
      "id": 21,
      "name": "Whoa",
      "category": "neutral",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/21.png",
      "animatedUrl": "/steam-awards/animated/21.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "22": {
      "id": 22,
      "name": "Super Star",
      "category": "positive",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/22.png",
      "animatedUrl": "/steam-awards/animated/22.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    },
    "23": {
      "id": 23,
      "name": "Heartwarming",
      "category": "positive",
      "rarity": "common",
      "staticUrl": "/steam-awards/static/23.png",
      "animatedUrl": "/steam-awards/animated/23.png",
      "animationWeight": 5,
      "floatSpeed": "fast",
      "size": "small"
    }
  },
  "categories": {
    "positive": [
      1,
      4,
      8,
      9,
      10,
      11,
      13,
      14,
      17,
      20,
      22,
      23
    ],
    "funny": [
      2,
      15,
      16,
      18,
      19
    ],
    "creative": [
      5,
      7
    ],
    "helpful": [
      6,
      12
    ],
    "neutral": [
      3,
      21
    ]
  },
  "rarities": {
    "common": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      12,
      13,
      14,
      15,
      16,
      18,
      19,
      20,
      21,
      22,
      23
    ],
    "rare": [],
    "epic": [
      11
    ],
    "legendary": [
      17
    ]
  },
  "floating": {
    "light": [
      1,
      3,
      4,
      6,
      8,
      9,
      10,
      12,
      13,
      14,
      20,
      21,
      22,
      23
    ],
    "colorful": [
      2,
      5,
      7,
      15,
      16,
      18,
      19
    ],
    "special": [
      11,
      17
    ]
  }
};

// Helper functions
export const getAwardById = (id: number): SteamAward | undefined => STEAM_AWARDS_CONFIG.awards[id];
export const getAwardsByCategory = (category: string): SteamAward[] => 
    (STEAM_AWARDS_CONFIG.categories[category] || []).map(id => STEAM_AWARDS_CONFIG.awards[id]);
export const getAwardsByRarity = (rarity: string): SteamAward[] => 
    (STEAM_AWARDS_CONFIG.rarities[rarity] || []).map(id => STEAM_AWARDS_CONFIG.awards[id]);
export const getFloatingAwards = (type: 'light' | 'colorful' | 'special'): SteamAward[] =>
    STEAM_AWARDS_CONFIG.floating[type].map(id => STEAM_AWARDS_CONFIG.awards[id]);
