export const downdloadBlob = (blob: Blob | null) => {
  if (!blob) return;

  const element = document.createElement("a");
  element.href = URL.createObjectURL(blob);
  element.download = "qrcode.png";
  element.click();
  console.log("download start");
};
