export const createExpDate = (
  date: string | null | undefined,
  time: string | null | undefined
): string => {
  if (!date) {
    return "";
  }

  if (!time) {
    time = "00:00";
  }

  const datetime = new Date(`${date}T${time}`);
  if (isNaN(datetime.getTime())) {
    return "";
  }

  //RFC3339 format: 2006-01-02T15:04:05-07:00
  return datetime.toISOString().replace(".000", "");
};
