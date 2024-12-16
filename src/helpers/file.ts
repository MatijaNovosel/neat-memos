import axios from "axios";

/**
 * Returns a file extension from a file name.
 * @param {string} fileName - File name.
 * @return File extension.
 */
export function getExtensionFromFileName(fileName: string): string {
  return fileName.split(".").pop() as string;
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * @return Formatted string.
 */
export function fileSizeReadable(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + " " + units[u];
}

/**
 * Returns an icon from a file extension.
 * @param {string} extension - File extension.
 * @return File icon.
 * @example const icon = getIconFromExtension("html"); // mdi-html
 */
export function getIconFromExtension(extension: string): string {
  switch (extension.toLowerCase()) {
    case "html":
    case "htm":
    case "shtml":
      return "mdi-language-html";
    case "css":
      return "mdi-language-css3";
    case "rss":
      return "mdi-rss-box";
    case "xml":
      return "mdi-file-xml-box";
    case "gif":
      return "mdi-file-gif-box";
    case "jpg":
    case "jpeg":
    case "bmp":
    case "tiff":
    case "png":
    case "ico":
    case "webp":
    case "tif":
      return "mdi-image-outline";
    case "js":
      return "mdi-language-javascript";
    case "atom":
      return "mdi-atom";
    case "mml":
    case "txt":
    case "htc":
    case "wbmp":
    case "wml":
    case "ps":
    case "eps":
    case "ai":
    case "rtf":
    case "jad":
    case "jng":
    case "wmlc":
    case "kml":
    case "kmz":
      return "mdi-text-box-outline";
    case "svg":
      return "mdi-svg";
    case "jar":
    case "war":
    case "ear":
      return "mdi-language-java";
    case "hqx":
      return "mdi-food-apple";
    case "doc":
      return "mdi-file-word-box";
    case "pdf":
      return "mdi-file-pdf-box";
    case "xls":
      return "mdi-file-excel-box";
    case "ppt":
      return "mdi-file-powerpoint-box";
    case "7z":
    case "zip":
    case "rar":
      return "mdi-zip-box";
    case "mp3":
    case "wav":
      return "mdi-music-note";
    default:
      return "mdi-file-outline";
  }
}

/**
 * Downloads a file provided in the function parameters as a public url.
 * @param {string} url - File url.
 */
export async function downloadFileFromUrl(url: string, fileName: string): Promise<void> {
  const resp = await axios.get(url, {
    responseType: "blob"
  });
  downloadBlob(resp, fileName);
}

/**
 * Downloads a file provided in the function parameters.
 * @param {File} file - File.
 */
export async function downloadFile(file: File) {
  const fileURL = window.URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = fileURL;
  link.setAttribute("download", file.name);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function downloadBlob(response: { data: BlobPart }, fileName: string) {
  const fileURL = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = fileURL;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function fileToBase64DataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error("FileReader did not produce a result."));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
