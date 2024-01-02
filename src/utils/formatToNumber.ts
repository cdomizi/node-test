export const formatToNumber = (input: string | number) =>
  typeof input === "number" ? input : parseInt(input);
