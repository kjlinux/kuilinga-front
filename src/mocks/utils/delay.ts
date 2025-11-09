/**
 * Network Delay Simulator
 *
 * Simulates realistic network latency for mock API responses
 */

import { MOCK_CONFIG } from '../config';

/**
 * Simulates network delay with random duration
 */
export const simulateDelay = (): Promise<void> => {
  const delay = Math.random() * (MOCK_CONFIG.maxDelay - MOCK_CONFIG.minDelay) + MOCK_CONFIG.minDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Simulates network delay with specific duration
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
