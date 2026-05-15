export function isValidUpc(value: string | null | undefined) {
  const digits = value?.replace(/\D/g, "") ?? "";

  if (digits.length !== 12) {
    return false;
  }

  const sum = digits
    .slice(0, 11)
    .split("")
    .reduce((total, digit, index) => {
      const weight = index % 2 === 0 ? 3 : 1;
      return total + Number(digit) * weight;
    }, 0);
  const checkDigit = (10 - (sum % 10)) % 10;

  return checkDigit === Number(digits[11]);
}
