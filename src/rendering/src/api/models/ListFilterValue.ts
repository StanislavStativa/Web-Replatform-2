/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListFilterOperator } from './ListFilterOperator';
export type ListFilterValue = {
  term?: string | null;
  operator?: ListFilterOperator;
  wildcardPositions?: Array<number> | null;
  readonly hasWildcard?: boolean;
};
