export const getStatus = (
  isEnabled: boolean,
  exp: Date | undefined
): string => {
  if (!isEnabled) {
    return "Disabled";
  }
  const now = new Date();
  if (exp && exp < now) {
    return "Expired";
  }

  return "Active";
};
