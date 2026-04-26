export const POINTS = {
  multipleChoice: 10,
  freeText: 25,
  matchingPair: 5,
} as const;

export const FUZZY_THRESHOLD = 0.8;

export const DIFFICULTY_LABELS: Record<string, { label: string; description: string; stars: string }> = {
  easy: { label: 'Kolay', description: 'Temel AB bilgisi', stars: '⭐' },
  medium: { label: 'Orta', description: 'Detaylı bilgi gerektirir', stars: '⭐⭐' },
  hard: { label: 'Zor', description: 'Uzman seviyesi', stars: '⭐⭐⭐' },
};

export const MOTIVATIONAL_MESSAGES = {
  excellent: { threshold: 80, message: 'Harika! AB konusunda gerçek bir uzman oluyorsun! 🎉' },
  good: { threshold: 50, message: 'İyi gidiyorsun! Biraz daha pratikle mükemmel olacak! 💪' },
  retry: { threshold: 0, message: 'Her deneme bir öğrenme fırsatı! Tekrar dene! 📚' },
};
