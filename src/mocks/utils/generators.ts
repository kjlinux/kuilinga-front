/**
 * Data Generator Utilities
 *
 * Provides utility functions for generating realistic mock data
 */

/**
 * Generates a random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random float between min and max
 */
export const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
};

/**
 * Picks a random element from an array
 */
export const randomElement = <T>(array: T[]): T => {
  return array[randomInt(0, array.length - 1)];
};

/**
 * Picks multiple random elements from an array
 */
export const randomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Generates a random date between start and end
 */
export const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Generates a random ISO date string
 */
export const randomISODate = (start: Date, end: Date): string => {
  return randomDate(start, end).toISOString();
};

/**
 * Generates a random boolean with optional probability
 */
export const randomBoolean = (probability: number = 0.5): boolean => {
  return Math.random() < probability;
};

/**
 * Generates a random UUID-like string
 */
export const randomUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Generates a random phone number (Burkina Faso format)
 */
export const randomPhone = (): string => {
  const formats = [
    '+226 ## ## ## ##',
    '+226 ## ## ## ##',
    '## ## ## ##',
    '## ## ## ##',
  ];
  const format = randomElement(formats);
  return format.replace(/#/g, () => randomInt(0, 9).toString());
};

/**
 * Generates a random email
 */
export const randomEmail = (firstName: string, lastName: string, domain: string = 'kuilinga.com'): string => {
  const patterns = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()[0]}${lastName.toLowerCase()}@${domain}`,
  ];
  return randomElement(patterns);
};

/**
 * Burkinabe first names (from various ethnic groups: Mossi, Peul, Dioula, etc.)
 */
export const burkinabeFirstNames = {
  male: [
    'Abdoulaye', 'Adama', 'Amadou', 'Boureima', 'Moussa', 'Ousmane', 'Seydou', 'Ibrahim',
    'Issouf', 'Karim', 'Mamadou', 'Hamidou', 'Souleymane', 'Zakaria', 'Yacouba', 'Rasmané',
    'Mahamadi', 'Souleyman', 'Boubacar', 'Salifou', 'Issaka', 'Boukary', 'Alassane', 'Idrissa',
  ],
  female: [
    'Fatoumata', 'Aminata', 'Mariam', 'Awa', 'Aïssatou', 'Sarata', 'Zalissa', 'Rakieta',
    'Rasmata', 'Hawa', 'Zenabo', 'Safiatou', 'Maïmouna', 'Salamata', 'Asseta', 'Bibata',
    'Adama', 'Fati', 'Kadi', 'Rokia', 'Zénabu', 'Kadiatou', 'Yacouba',
  ],
};

/**
 * Burkinabe last names (from various ethnic groups)
 */
export const burkinabeLastNames = [
  'Ouédraogo', 'Sawadogo', 'Compaoré', 'Zoungrana', 'Kaboré', 'Traoré', 'Koné', 'Ouattara',
  'Sankara', 'Zongo', 'Diallo', 'Barry', 'Barro', 'Kinda', 'Tapsoba', 'Kaboré',
  'Nacoulma', 'Ilboudo', 'Kéré', 'Sana', 'Tao', 'Sorgho', 'Nikiema', 'Yé',
];

/**
 * Generates a random Burkinabe full name
 */
export const randomBurkinabeName = (): { firstName: string; lastName: string; gender: 'male' | 'female' } => {
  const gender = randomBoolean() ? 'male' : 'female';
  const firstName = randomElement(burkinabeFirstNames[gender]);
  const lastName = randomElement(burkinabeLastNames);
  return { firstName, lastName, gender };
};

/**
 * @deprecated Use randomBurkinabeName instead
 */
export const randomFrenchName = randomBurkinabeName;

/**
 * Burkinabe cities
 */
export const burkinabeCities = [
  'Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Ouahigouya', 'Banfora', 'Dédougou',
  'Kaya', 'Tenkodogo', 'Fada N\'Gourma', 'Gaoua', 'Ziniaré', 'Réo', 'Kongoussi',
  'Manga', 'Dori', 'Diébougou', 'Houndé', 'Nouna', 'Pouytenga', 'Bogandé', 'Léo',
];

/**
 * @deprecated Use burkinabeCities instead
 */
export const frenchCities = burkinabeCities;

/**
 * Company name suffixes
 */
export const companySuffixes = ['SAS', 'SARL', 'SA', 'Group', 'International', 'France'];

/**
 * Job titles in French
 */
export const frenchJobTitles = [
  'Développeur', 'Développeuse', 'Chef de projet', 'Directeur technique', 'Directrice technique',
  'Responsable RH', 'Assistant RH', 'Assistante RH', 'Comptable', 'Chargé de communication',
  'Commercial', 'Commerciale', 'Manager', 'Consultant', 'Consultante', 'Analyste',
  'Designer', 'Architecte logiciel', 'DevOps', 'Data Scientist', 'Product Owner',
];

/**
 * Department names in French
 */
export const frenchDepartments = [
  'Informatique', 'Ressources Humaines', 'Commercial', 'Marketing', 'Finance',
  'Production', 'Logistique', 'R&D', 'Support Client', 'Administration',
  'Qualité', 'Achats', 'Communication', 'Direction',
];
