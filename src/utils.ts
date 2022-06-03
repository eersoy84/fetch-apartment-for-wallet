const WORLDWIDE_WEBB_APARTMENT_ADDRESS = "0xa1d4657e0e6507d5a94d06da93e94dc7c8c44b51";
export { WORLDWIDE_WEBB_APARTMENT_ADDRESS };

export function bufferToBase64Uri(buffer: Buffer): string {
  if (buffer.slice(0, 8).equals(Buffer.from("89504E470D0A1A0A", "hex"))) {
    return `data:image/png;base64,${buffer.toString("base64")}`;
  }
  if (buffer.slice(0, 2).equals(Buffer.from("FFD8", "hex")) && buffer.slice(-2).equals(Buffer.from("FFD9", "hex"))) {
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  }
  if (buffer.slice(0, 5).equals(Buffer.from("<svg ", "ascii"))) {
    return `data:image/svg+xml;base64,${buffer.toString("base64")}`;
  }
  if (buffer.slice(0, 3).equals(Buffer.from("GIF ", "ascii"))) {
    return `data:image/gif;base64,${buffer.toString("base64")}`;
  }
  return "";
}

export function getApartmentType(apartmentId: string): string {
  const id = Number(apartmentId);

  if (id < 5000) return "small";
  if (id < 8000) return "medium";
  if (id < 9000) return "large";
  if (id < 9069) return "penthouse";
  if (id < 9269) return "small";
  if (id < 9458) return "medium";
  if (id < 9508) return "large";

  // Test apartments
  if (id == 9996) return "small";
  if (id == 9997) return "medium";
  if (id == 9998) return "large";
  if (id == 9999) return "penthouse";

  return "unknown";
}
