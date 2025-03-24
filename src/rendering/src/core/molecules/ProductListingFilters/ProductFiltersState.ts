import { atom } from 'jotai';
import { ProductFilterState, ProductSortState } from '../ProductListing/ProductListing.type';
import { SelectedFilterState } from './ProductFilter.type';

export const filterValue = atom<ProductFilterState>({});
export const selectedFilter = atom<SelectedFilterState[]>([]);
export const sortValue = atom<ProductSortState[]>([]);
export const activePage = atom<number | undefined>(undefined);
export const viewAllProduct = atom<boolean>(false);
export const openFacet = atom<string>('');
export const filterOpen = atom<boolean>(true);
