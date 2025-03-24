import { ImageField, Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ProductListingData } from '../ProductListing/ProductListing.type';

export interface SearchBarFieldProps {
  CrossIcon: ImageField;
  SearchIcon: ImageField;
  ResultsPageLink: LinkField;
  SearchPlaceholderText: Field<string>;
  CancelButtonText: Field<string>;
  RequiredMessage: Field<string>;
  CategoryMaxSuggestion: Field<number>;
  DefaultItemsPerPageDesktop: Field<string>;
  DefaultItemsPerPageMobile: Field<string>;
  DiscoverRfkId: Field<string>;
  KeyphraseMaxSuggestion: Field<number>;
}

export interface SearchProductProps extends ProductListingData {
  context: {
    page: { uri: string };
    store: { id: string };
    user: { uuid: string };
  };
  widget: { rfkid: string };
  n_item: number;
  page_number: number;
  facet?: { all: boolean };
  sort: { value: { name: string; order: string }[]; choices: boolean };
  filter?: {
    [key: string]: {
      value: string[];
    };
  };
  suggestion?: { keyphrase: [CategoryFieldProps]; category: CategoryFieldProps[] };
  query?: {
    keyphrase: {
      value: string[];
    };
  };
  resultPageLink: LinkField;
  searchValue: string;
  clearSearch: () => void;
}

export interface CategoryFieldProps {
  id: string;
  text: string;
  url?: string;
}
