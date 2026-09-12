export const AMBIGUOUS_CHARACTERS = "0O1lI";

export const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|:,.<>/?~",
};

export const DEFAULT_OPTIONS = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: true,
};

function randomIndex(limit) {
  const largestMultiple = Math.floor(0x1_0000_0000 / limit) * limit;
  const value = new Uint32Array(1);

  do {
    crypto.getRandomValues(value);
  } while (value[0] >= largestMultiple);

  return value[0] % limit;
}

function shuffle(values) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const otherIndex = randomIndex(index + 1);
    [values[index], values[otherIndex]] = [values[otherIndex], values[index]];
  }
  return values;
}

export function availableCharacters(type, excludeAmbiguous) {
  const characters = CHARSETS[type];
  return excludeAmbiguous
    ? [...characters].filter((character) => !AMBIGUOUS_CHARACTERS.includes(character)).join("")
    : characters;
}

export function generatePassword(options = {}) {
  const settings = { ...DEFAULT_OPTIONS, ...options };
  const selectedTypes = Object.keys(CHARSETS).filter((type) => settings[type]);

  if (!Number.isInteger(settings.length) || settings.length < selectedTypes.length) {
    throw new RangeError("Length must be an integer at least as large as the selected character types.");
  }
  if (selectedTypes.length === 0) {
    throw new RangeError("Select at least one character type.");
  }

  const groups = selectedTypes.map((type) => availableCharacters(type, settings.excludeAmbiguous));
  const allCharacters = groups.join("");
  const password = groups.map((group) => group[randomIndex(group.length)]);

  while (password.length < settings.length) {
    password.push(allCharacters[randomIndex(allCharacters.length)]);
  }

  return shuffle(password).join("");
}
