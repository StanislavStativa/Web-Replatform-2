import React, { useEffect, useState } from 'react';
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete';
import { ITypesPlacesAutocomplete } from './PlacesAutocomplete.type';
import { cn } from '@/utils/cn';
import { useFormContext } from 'react-hook-form';
import ErrorMessage from '@/core/atoms/Form/ErrorMessage/ErrorMessage';
import useNavigationClickOutside from '../SecondaryNavigation/useNavigationClickOutside';

const PlacesAutocomplete = ({
  onAddressSelect,
  name,
  className,
  placeholder,
}: ITypesPlacesAutocomplete) => {
  const { formState, getValues, setValue: formSetValue } = useFormContext();
  const [streetAddress, setStreetAddress] = useState<string>(''); // State for formatted street address
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<string | null>('');
  const onOutsideClick = () => {
    setShowOptions(false);
    setResponseStatus(null);
  };
  const outsideClick = useNavigationClickOutside(onOutsideClick);
  const {
    ready,
    value,
    suggestions: { status, data, loading },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: ['us'] },
      types: ['address'],
    },
    debounce: 300,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value); // Update the input value
    formSetValue(name, e.target.value); // Update the form value
    setStreetAddress(''); // Clear the formatted street address when user types
  };

  const handleSelect = async (address: string) => {
    setShowOptions(false);
    setValue(address, false); // Set the full address internally
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      // Extract address components
      const addressComponents = results[0].address_components;

      // Helper function to get specific address component
      const getComponent = (type: string) => {
        return (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          addressComponents.find((component: any) => component.types.includes(type))?.long_name ||
          ''
        );
      };

      // Extract address details
      const street = `${getComponent('street_number')} ${getComponent('route')}`;
      const city = getComponent('locality');
      const state = getComponent('administrative_area_level_1');
      const zip = getComponent('postal_code');

      // Update the formatted street address for display
      // setStreetAddress(street);

      // Pass the full address details to the callback
      if (onAddressSelect) {
        onAddressSelect(street, city, state, zip);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  useEffect(() => {
    const fieldValue = getValues(name);
    setStreetAddress(fieldValue);
  }, [formState, name, getValues]);

  useEffect(() => {
    if (responseStatus === 'OK' && !showOptions) {
      setShowOptions(true);
    }
  }, [responseStatus, showOptions]);

  useEffect(() => {
    if (status === 'OK') {
      setResponseStatus('OK');
    } else {
      setResponseStatus(null);
    }
  }, [status]);

  return (
    <div ref={outsideClick} className="relative">
      <input
        name={name}
        value={streetAddress || value} // Display streetAddress if available, otherwise the typed value
        onChange={handleInput}
        disabled={!ready}
        placeholder={placeholder}
        className={cn(
          'border rounded-md focus:outline-none border-input-dark-gray py-3 px-3 text-base w-full',
          className,
          {
            'border-red-500 bg-light-red  placeholder-light-slate-red': formState.errors[name],
          }
        )}
      />
      {loading && (
        <div className="absolute right-0 top-0 h-full flex items-center">
          <svg
            className="mr-3 size-6 animate-spin"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle className="opacity-20" cx="24" cy="24" r="20" fill="gray"></circle>

            <g className="animate-pulse">
              <path fill="#EA4335" d="M23.5 12h1v8h-1z"></path>
              <path fill="#FBBC05" d="M34 23.5v1h-8v-1z"></path>
              <path fill="#34A853" d="M23.5 34h1v-8h-1z"></path>
              <path fill="#4285F4" d="M12 23.5v1h8v-1z"></path>
            </g>
          </svg>
        </div>
      )}

      {showOptions && (
        <ul className="absolute w-full mt-2 max-h-64 overflow-y-auto border rounded shadow-lg bg-white z-10">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="cursor-pointer py-2 px-4 hover:bg-browser-blue hover:text-white focus:bg-browser-blue focus:text-white"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
      {formState.errors[name] && <ErrorMessage name={name} />}
    </div>
  );
};

export default PlacesAutocomplete;
