export const isObject = (value: unknown): value is object => {
  const type = typeof value;
  return type === "function" || (type === "object" && !!value);
};
