export const copyToClipboard = (value: string | Blob | null) => {
  if (!value) return;

  const item =
    typeof value === "string"
      ? [new ClipboardItem({ ["text/plain"]: value })]
      : [new ClipboardItem({ ["image/png"]: value })];

  try {
    navigator.clipboard
      .write(item)
      .then(() => {
        console.log("Copied value to clipboard");
      })
      .catch((err) => {
        console.error("Error: ", err);
      });
  } catch (err) {
    console.error("Error: ", err);
  }
};
