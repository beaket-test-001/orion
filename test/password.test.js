import assert from "node:assert/strict";
import test from "node:test";
import { AMBIGUOUS_CHARACTERS, CHARSETS, generatePassword } from "../password.js";

const includesOneFrom = (password, characters) => [...password].some((character) => characters.includes(character));

test("defaults create a 16-character password with every character type", () => {
  const password = generatePassword();

  assert.equal(password.length, 16);
  for (const characters of Object.values(CHARSETS)) assert.ok(includesOneFrom(password, characters));
  assert.ok([...password].every((character) => !AMBIGUOUS_CHARACTERS.includes(character)));
});

test("selected types are guaranteed and ambiguous characters can be allowed", () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const password = generatePassword({ length: 8, uppercase: true, lowercase: false, numbers: true, symbols: false, excludeAmbiguous: false });
    assert.equal(password.length, 8);
    assert.ok(includesOneFrom(password, CHARSETS.uppercase));
    assert.ok(includesOneFrom(password, CHARSETS.numbers));
    assert.ok([...password].every((character) => (CHARSETS.uppercase + CHARSETS.numbers).includes(character)));
  }
});

test("invalid selections are rejected", () => {
  assert.throws(() => generatePassword({ uppercase: false, lowercase: false, numbers: false, symbols: false }), RangeError);
  assert.throws(() => generatePassword({ length: 1, uppercase: true, lowercase: true, numbers: false, symbols: false }), RangeError);
});

test("special characters exclude shell-hostile characters from the agreed set", () => {
  assert.equal(CHARSETS.symbols, "!@#$%^&*()-_=+[]{}|:,.<>/?~");
  for (const character of "'\"\\; ") assert.equal(CHARSETS.symbols.includes(character), false);
});
