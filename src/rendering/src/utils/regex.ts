export const anchorIdRegex = /name="([^"]+)" id="([^"]+)"/g;
export const headingRegex = /<h2[^>]*>(.*?)<\/h2>/g;
export const accordionSectionRegex = /<section class="accordion">(.*?)<\/section>/gs;
export const subTitleRegex = /<h3[^>]*>(.*?)<\/h3>/gs;
export const subAnchorRegex = /id="([^"]+)"/gs;

export const extractProductId = (url: string) => {
  if (!url) {
    return '';
  }
  const match = url.match(/(\d+)$/); // Finds the last number in the URL
  return match ? match[1] : null; // Returns the number or null if not found
};
