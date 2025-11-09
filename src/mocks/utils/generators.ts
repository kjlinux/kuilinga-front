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
 * Generates a random phone number
 */
export const randomPhone = (): string => {
  const formats = [
    '+33 6 ## ## ## ##',
    '+33 7 ## ## ## ##',
    '06 ## ## ## ##',
    '07 ## ## ## ##',
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
 * French first names
 */
export const frenchFirstNames = {
  male: [
    'Alexandre', 'Antoine', 'Arthur', 'Baptiste', 'Benjamin', 'Charles', 'Clément', 'David',
    'Étienne', 'François', 'Gabriel', 'Hugo', 'Jean', 'Julien', 'Louis', 'Lucas',
    'Mathieu', 'Maxime', 'Nicolas', 'Olivier', 'Paul', 'Pierre', 'Raphaël', 'Thomas',
  ],
  female: [
    'Alice', 'Amélie', 'Anna', 'Camille', 'Charlotte', 'Chloé', 'Clara', 'Élise',
    'Emma', 'Jade', 'Jeanne', 'Julie', 'Juliette', 'Léa', 'Louise', 'Manon',
    'Marie', 'Mathilde', 'Océane', 'Sarah', 'Sophie', 'Valentine', 'Zoé',
  ],
};

/**
 * French last names
 */
export const frenchLastNames = [
  'Bernard', 'Bonnet', 'Dubois', 'Durand', 'Fournier', 'Garnier', 'Girard', 'Lambert',
  'Lefebvre', 'Leroy', 'Martin', 'Mercier', 'Michel', 'Moreau', 'Petit', 'Richard',
  'Robert', 'Roux', 'Simon', 'Thomas',
];

/**
 * Generates a random French full name
 */
export const randomFrenchName = (): { firstName: string; lastName: string; gender: 'male' | 'female' } => {
  const gender = randomBoolean() ? 'male' : 'female';
  const firstName = randomElement(frenchFirstNames[gender]);
  const lastName = randomElement(frenchLastNames);
  return { firstName, lastName, gender };
};

/**
 * French cities
 */
export const frenchCities = [
  'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier',
  'Bordeaux', 'Lille', 'Rennes', 'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble',
  'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Saint-Denis', 'Clermont-Ferrand',
];

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
