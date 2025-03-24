interface DropdownOption {
  label: string;
  value: number;
}
const monthDropdown: DropdownOption[] = Array.from({ length: 12 }, (_v, i) => ({
  label: (i + 1).toString(),
  value: i + 1,
}));
const currentYear = new Date().getFullYear();
const yearDropdown: DropdownOption[] = Array.from({ length: 6 }, (_v, i) => ({
  label: (currentYear + i).toString(),
  value: currentYear + i,
}));
export { monthDropdown, yearDropdown };
