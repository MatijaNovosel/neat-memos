/**
 * Capitalizes the given text
 * @param {string} text - The text which should be capitalized.
 * @return Capitalized text.
 */
export function capitalize(text: string | undefined) {
  if (!text) return text;
  return text[0].toUpperCase() + text.substring(1).toLowerCase();
}

/**
 * Cuts a text off at a certain length, ending it with three dots.
 * @param {string} text - The text which should be cut off.
 * @param {number} length - The length at which the text should be cut off.
 * @return Ellipsed text.
 */
export function textEllipsis(text: string | null | undefined, length: number): string {
  if (text) {
    if (text.length <= length) {
      return text;
    }
    return `${text.substring(0, length)}...`;
  }
  return "";
}

/**
 * Creates an acronym of a given string.
 * @param {string} str - String from which to create an acronym from.
 * @return Acronym.
 * @example const acr = acronym("Ivica Markovic"); // "IM"
 */
export function acronym(str: string | null | undefined): string {
  if (str == null || str == undefined) {
    return "";
  }

  let acronym = "";
  const words = str.split(" ");

  for (let i = 0; i < words.length; i++) {
    const splitted = words[i].split("-");
    for (let s = 0; s < splitted.length; s++) {
      const chr = splitted[s].charAt(0);
      if (chr.match(/[A-Za-zŠĐŽĆČšđžćč]+/) != null) {
        acronym = acronym + chr;
      }
    }
  }

  return acronym.toUpperCase();
}

/**
 * Formats a concatenated string which consists of given capitalized arguments.
 * @param {...string} args - String from which to create the full name from.
 * @return Full name.
 * @example const fullName = formatFullName("branko", "ivan", "marković"); // "Branko Ivan Marković"
 */
export function formatFullName(...args: (string | undefined)[]): string | null {
  if (args.some((t) => t !== null)) {
    return args
      .filter((t) => t !== null && t !== undefined)
      .map((t) => capitalize(t) || "Error")
      .join(" ");
  }
  return null;
}

export function generateGuid() {
  return crypto.randomUUID();
}
