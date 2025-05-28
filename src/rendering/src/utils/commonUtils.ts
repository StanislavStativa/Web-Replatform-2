interface Item {
  [key: string]: string | number | undefined;
}

export const findKeyByString = <T extends Item>(
  searchString: string,
  displayKey: keyof T,
  array: T[],
  idKey: keyof T
): string | undefined => {
  const lowerCaseSearchString = searchString.toLowerCase();

  const foundItem = array.find((item) => {
    const value = item[displayKey];
    return value !== undefined && value.toString().toLowerCase() === lowerCaseSearchString;
  });

  return foundItem ? foundItem[idKey]?.toString() : undefined;
};
