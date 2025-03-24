export interface ProductFilterData {
  facet: ProductFacet;
  facet_names: string[];
  sort: ProductSort;
}

export interface SortFilterProps {
  sortData: ProductSort;
  pageSize: string;
}

export interface ProductFacet {
  [key: string]: {
    display_name: string;
    number_of_products: number;
    value: ProductFilterFacetValue[];
  };
}

export interface ProductFilterFacetValue {
  count: number;
  id: string;
  in_content: string;
  text: string;
}
export interface ProductSort {
  choices: ProductSortField[];
}

export interface ProductSortField {
  name: string;
  order: string;
  label: string;
}

export interface ProductFilterButton {
  text: string;
  children: JSX.Element;
}

export interface ProductFilterProps {
  facet: ProductFacet;
  facet_name: string;
  onCheckedFilter: (facet_text: string, facet_name: string, id: string) => void;
}

export interface SelectedFilterState {
  text: string;
  id: string;
  facet_name: string;
}
