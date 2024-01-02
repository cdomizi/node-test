export const capitalize = (str: string) =>
  str.length > 0 ? `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}` : "";

export const formatToNumber = (input: string | number) =>
  typeof input === "number" ? input : parseInt(input);
