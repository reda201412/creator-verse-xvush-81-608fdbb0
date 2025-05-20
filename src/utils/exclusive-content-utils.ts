
// Utility functions for exclusive content

// Function to generate a encryption session key
export const generateEncryptionKey = (): string => {
  return Array.from(
    { length: 32 },
    () => Math.floor(Math.random() * 36).toString(36)
  ).join('');
};

// Function to ensure required properties for restrictions
export const ensureRequiredRestrictionProps = (restrictions: any) => {
  return {
    ...restrictions,
    downloadsAllowed: restrictions.downloadsAllowed ?? false,
    sharingAllowed: restrictions.sharingAllowed ?? false,
  };
};
