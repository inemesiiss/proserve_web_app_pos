/**
 * Convert any type of input (number, string, float, decimal) to currency format
 * @param value - The value to format (number, string, or any numeric type)
 * @param currencySign - Currency symbol (default: ₱)
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Formatted currency string (e.g., "₱1,234.56")
 */
export const formatCurrency = (
  value: string | number | null | undefined,
  currencySign: string = "₱",
  decimalPlaces: number = 2
): string => {
  // Handle null or undefined
  if (value === null || value === undefined) {
    return `${currencySign}0.${String(0).repeat(decimalPlaces)}`;
  }

  // Convert to number if it's a string
  let numValue: number;
  if (typeof value === "string") {
    numValue = parseFloat(value);
  } else {
    numValue = Number(value);
  }

  // Check if the conversion was successful
  if (isNaN(numValue)) {
    return `${currencySign}0.${String(0).repeat(decimalPlaces)}`;
  }

  // Format the number with proper decimal places and thousand separators
  const formattedNumber = numValue.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return `${currencySign}${formattedNumber}`;
};

/**
 * Just the number part without currency sign
 * @param value - The value to format
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Formatted number string (e.g., "1,234.56")
 */
export const formatNumber = (
  value: string | number | null | undefined,
  decimalPlaces: number = 2
): string => {
  // Handle null or undefined
  if (value === null || value === undefined) {
    return `0.${String(0).repeat(decimalPlaces)}`;
  }

  // Convert to number if it's a string
  let numValue: number;
  if (typeof value === "string") {
    numValue = parseFloat(value);
  } else {
    numValue = Number(value);
  }

  // Check if the conversion was successful
  if (isNaN(numValue)) {
    return `0.${String(0).repeat(decimalPlaces)}`;
  }

  // Format the number with proper decimal places and thousand separators
  return numValue.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};

/**
 * Simple decimal formatter (just 2 decimal places, no thousand separators)
 * @param value - The value to format
 * @returns Formatted decimal string (e.g., "1234.56")
 */
export const formatDecimal = (
  value: string | number | null | undefined
): string => {
  // Handle null or undefined
  if (value === null || value === undefined) {
    return "0.00";
  }

  // Convert to number if it's a string
  let numValue: number;
  if (typeof value === "string") {
    numValue = parseFloat(value);
  } else {
    numValue = Number(value);
  }

  // Check if the conversion was successful
  if (isNaN(numValue)) {
    return "0.00";
  }

  return numValue.toFixed(2);
};
