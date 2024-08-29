export default function base64ToFile(
  base64String: string,
  filename: string,
  mimeType: string
): File {
  const byteString = atob(base64String.split(",")[1]);

  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([uint8Array], { type: mimeType });

  return new File([blob], filename, { type: mimeType });
}
