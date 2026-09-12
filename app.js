import { AMBIGUOUS_CHARACTERS, CHARSETS, DEFAULT_OPTIONS, generatePassword } from "./password.js";

const form = document.querySelector("form");
const lengthInput = document.querySelector("#length");
const generateButton = document.querySelector("button[type=submit]");
const result = document.querySelector("#result");
const specialCharacters = document.querySelector("#special-characters");

specialCharacters.textContent = CHARSETS.symbols;

function selectedTypeCount() {
  return [...form.querySelectorAll("input[name=type]")].filter((input) => input.checked).length;
}

function updateConstraints() {
  const minimumLength = selectedTypeCount();
  lengthInput.min = minimumLength;
  if (Number(lengthInput.value) < minimumLength) lengthInput.value = minimumLength;
  generateButton.disabled = minimumLength === 0;
}

function optionsFromForm() {
  return {
    length: Number(lengthInput.value),
    uppercase: form.uppercase.checked,
    lowercase: form.lowercase.checked,
    numbers: form.numbers.checked,
    symbols: form.symbols.checked,
    excludeAmbiguous: form.excludeAmbiguous.checked,
  };
}

form.addEventListener("change", updateConstraints);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  result.value = generatePassword(optionsFromForm());
});

Object.entries(DEFAULT_OPTIONS).forEach(([name, value]) => {
  if (typeof value === "boolean") form[name].checked = value;
  else form[name].value = value;
});
updateConstraints();
