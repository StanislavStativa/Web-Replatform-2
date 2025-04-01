import { JSDOM } from 'jsdom';

function cleanBodyHTML(body: HTMLElement): string {
  const allowedTags = ['style', 'noscript', 'script', 'main', 'h1', 'div', 'p', 'small'];

  Array.from(body.children).forEach((child) => {
    if (!allowedTags.includes(child.tagName.toLowerCase())) {
      body.removeChild(child);
    }
  });

  return body.innerHTML;
}

const mapProp = (propName: string) => {
  const PROPS: Record<string, string> = {
    onload: 'onLoad',
  };

  return PROPS[propName] || propName;
};

const getTagProps = (el: Element) => ({
  ...Array.from(el.attributes).reduce<Record<string, string>>((acc, attr) => {
    acc[mapProp(attr.name)] = attr.value;
    return acc;
  }, {}),
});

function parseHeadMarkup(head: HTMLElement) {
  const headElements = head.children;

  return Array.from(headElements).reduce(
    (acc, el, index) => {
      const elData = {
        tagName: el.tagName.toLowerCase(),
        key: index + el.tagName.toLowerCase(),
        __html: el.innerHTML,
        ...getTagProps(el),
      };

      if (el.tagName.toLowerCase() === 'link' && el.getAttribute('rel') === 'stylesheet') {
        acc.body.push(elData);
        return acc;
      }

      acc.head.push(elData);
      return acc;
    },
    { head: [], body: [] } as {
      head: Array<{ key: string; __html: string; tagName: string; [k: string]: string }>;
      body: Array<{ key: string; __html: string; tagName: string; [k: string]: string }>;
    }
  );
}

export const parseHtmlMarkup = (htmlString: string) => {
  try {
    const dom = new JSDOM(htmlString);
    const doc = dom.window.document;
    const slHeader = parseHeadMarkup(doc.head);
    const slBody = cleanBodyHTML(doc.body);
    return {
      slHeader,
      slBody,
    };
  } catch (error) {
    console.error('Error parsing page markup:', error);
    return {
      slHeader: {
        head: [],
        body: [],
      },
      slBody: '',
    };
  }
};

export const getHtmlMarkup = async (url: string) => {
  try {
    const response = await fetch(new URL(url));
    const markup = await response.text();
    return parseHtmlMarkup(markup);
  } catch (error) {
    console.error('Error fetching page markup:', error);
    return {
      slHeader: {
        head: [],
        body: [],
      },
      slBody: '',
    };
  }
};

export type MarkupData = Awaited<ReturnType<typeof getHtmlMarkup>>;
