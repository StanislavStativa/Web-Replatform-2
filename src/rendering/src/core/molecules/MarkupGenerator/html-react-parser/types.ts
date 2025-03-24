import type { DomHandlerOptions } from 'domhandler';
import type { DOMNode } from 'html-dom-parser';
import type { ParserOptions } from 'htmlparser2';
import type { JSX, ReactNode } from 'react';

export interface HTMLReactParserOptions {
  htmlparser2?: ParserOptions & DomHandlerOptions;

  library?: {
    cloneElement: (element: JSX.Element, props?: object, ...children: unknown[]) => JSX.Element;
    createElement: (type: unknown, props?: object, ...children: unknown[]) => JSX.Element;
    isValidElement: (element: unknown) => boolean;
    [key: string]: unknown;
  };

  replace?: (
    domNode: DOMNode,
    index: number
  ) => JSX.Element | string | null | boolean | object | void;

  transform?: (
    reactNode: ReactNode,
    domNode: DOMNode,
    index: number
  ) => JSX.Element | string | null | void;

  trim?: boolean;
}
