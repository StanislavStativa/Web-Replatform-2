export interface ITypesPlacesAutocomplete {
  name: string;
  className?: string;
  onAddressSelect?: (address: string, city: string, state: string, zip: string) => void;
  placeholder?: string;
}
