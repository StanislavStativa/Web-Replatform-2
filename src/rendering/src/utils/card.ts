export const getCardBrand = (message: string | null | undefined): string => {
  // Check for null, undefined, or empty string
  if (!message || message?.trim() === '') {
    return '';
  }

  // Extract the first two characters of the message using substring
  const tokenizedVal = message?.substring(0, 2);

  // Determine the card brand based on the extracted value
  switch (tokenizedVal) {
    case '93':
      return 'AMEX';
    case '94':
      return 'VISA';
    case '95':
    case '92':
      return 'MC';
    case '96':
      return 'DISCOVER';
    default:
      return 'UNKNOWN';
  }
};
