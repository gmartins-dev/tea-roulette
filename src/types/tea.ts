export type TeaCategory = 'green' | 'black' | 'herbal' | 'oolong';
export type CaffeineLevel = 'none' | 'low' | 'medium' | 'high';

export interface TeaPreferences {
  caffeine: CaffeineLevel;
}

export interface Tea {
  name: string;
  category: TeaCategory;
  caffeineLevel: CaffeineLevel;
}
