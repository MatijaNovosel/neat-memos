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
 * Returns a mime type from a file extension.
 * @param {string} extension - File extension.
 * @return Mime type of the file.
 * @example const mimeType = getMimeTypeFromExtension("html"); // text/html
 */
export function getMimeTypeFromExtension(extension: string): string {
  switch (extension.toLowerCase()) {
    case "html":
    case "htm":
    case "shtml":
      return "text/html";
    case "css":
      return "text/css";
    case "xml":
      return "text/xml";
    case "gif":
      return "image/gif";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "js":
      return "application/x-javascript";
    case "atom":
      return "application/atom+xml";
    case "rss":
      return "application/rss+xml";
    case "mml":
      return "text/mathml";
    case "txt":
      return "text/plain";
    case "jad":
      return "text/vnd.sun.j2me.app-descriptor";
    case "wml":
      return "text/vnd.wap.wml";
    case "htc":
      return "text/x-component";
    case "png":
      return "image/png";
    case "tiff":
    case "tif":
      return "image/tiff";
    case "wbmp":
      return "image/vnd.wap.wbmp";
    case "ico":
      return "image/x-icon";
    case "jng":
      return "image/x-jng";
    case "bmp":
      return "image/x-ms-bmp";
    case "svg":
      return "image/svg+xml";
    case "webp":
      return "image/webp";
    case "jar":
    case "war":
    case "ear":
      return "application/java-archive";
    case "hqx":
      return "application/mac-binhex40";
    case "doc":
      return "application/msword";
    case "pdf":
      return "application/pdf";
    case "ps":
    case "eps":
    case "ai":
      return "application/postscript";
    case "rtf":
      return "application/rtf";
    case "xls":
      return "application/vnd.ms-excel";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "wmlc":
      return "application/vnd.wap.wmlc";
    case "kml":
      return "application/vnd.google-earth.kml+xml";
    case "kmz":
      return "application/vnd.google-earth.kmz";
    case "7z":
      return "application/x-7z-compressed";
    case "cco":
      return "application/x-cocoa";
    case "jardiff":
      return "application/x-java-archive-diff";
    case "jnlp":
      return "application/x-java-jnlp-file";
    case "run":
      return "application/x-makeself";
    case "pl":
    case "pm":
      return "application/x-perl";
    case "prc":
    case "pdb":
      return "application/x-pilot";
    case "rar":
      return "application/x-rar-compressed";
    case "rpm":
      return "application/x-redhat-package-manager";
    case "sea":
      return "application/x-sea";
    case "swf":
      return "application/x-shockwave-flash";
    case "sit":
      return "application/x-stuffit";
    case "tcl":
    case "tk":
      return "application/x-tcl";
    case "der":
    case "pem":
    case "crt":
      return "application/x-x509-ca-cert";
    case "xpi":
      return "application/x-xpinstall";
    case "xhtml":
      return "application/xhtml+xml";
    case "zip":
      return "application/zip";
    case "mp3":
      return "audio/x-mp3";
    case "wav":
      return "audio/x-wav";
    default:
      return "application/pdf";
  }
}

export function getContentDispositionName(response: { data?: BlobPart; headers? }) {
  const regex = /filename[^;=\n]*=((['']).*?\2|[^;\n]*)/;
  const matches = regex.exec(response.headers["content-disposition"]);
  let filename = "";

  if (matches != null && matches[1]) {
    filename = matches[1].replace(/\s/g, "").replace(/"/g, "");
  }

  return decodeURI(filename);
}

/**
 * Downloads a file provided in the function parameters as a public url.
 * @param {string} url - File url.
 */
export async function downloadFileFromUrl(url: string, fileName: string) {
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
  if ((window.navigator as any).msSaveOrOpenBlob) {
    // IE11
    (window.navigator as any).msSaveOrOpenBlob(file, file.name);
  } else {
    const fileURL = window.URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

export function downloadBlob(response: { data: BlobPart }, fileName: string) {
  if ((window.navigator as any).msSaveOrOpenBlob) {
    // IE11
    (window.navigator as any).msSaveOrOpenBlob(new Blob([response.data]), fileName);
  } else {
    const fileURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
