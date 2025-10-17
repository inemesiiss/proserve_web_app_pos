export const toSlug = (str: string): string => {
  return str.toLowerCase().replace(/\s+/g, "-");
};

export const toReadable = (slug: string): string => {
  return slug.replace(/-/g, " ");
};
