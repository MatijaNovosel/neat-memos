import { randInt } from "./math";

/**
 * Gets a random element of an array.
 * @param {any[]} arr
 * @example
 * sample([1, 2, 3]); // 2
 */
export const sample = (arr: any[]): any => arr[randInt(0, arr.length - 1)];

/**
 * Generates a string composed of `n` random characters.
 * @param {number} n
 * @example
 * generateRandomString(5); // "AXRF0"
 */
export const generateRandomString = (n: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let res = "";
  while (n--) res += sample(characters.split(""));
  return res;
};
