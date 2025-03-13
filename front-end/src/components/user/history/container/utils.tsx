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

export const mockToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDE5MDY4NDAsImlhdCI6MTc0MTkwNTA0MCwidXNlcklEIjoiMzVmN2E0MjEifQ.IGFY92DR4KWBB5YNJAHys27kte09x9MTEOsCbByfQUs";
