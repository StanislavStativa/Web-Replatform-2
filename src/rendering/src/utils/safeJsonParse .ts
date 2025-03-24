export const safeJsonParse = (jsonString: string, defaultValue = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
};

export function extractTextFromHTML(htmlString: string): string {
  if (typeof window !== 'undefined') {
    // Browser environment - Using DOMParser
    const parser = new DOMParser();
    const doc = parser?.parseFromString(htmlString, 'text/html');
    return doc?.body?.textContent || '';
  } else {
    // Server-side (Node.js) environment - Using regex to strip HTML tags
    return htmlString?.replace(/<[^>]*>/g, '');
  }
}
