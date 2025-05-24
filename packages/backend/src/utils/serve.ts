import fsPromises from 'fs/promises';
import mime from 'mime';
import path from 'path';

/**
 * Serves a file, attempting to use pre-compressed versions (Brotli or Gzip)
 * if supported by the client and available on the server.
 * Sets appropriate 'Content-Encoding', 'Content-Type', and 'Cache-Control' headers.
 *
 * @param filePath The path to the original (uncompressed) file.
 * @param acceptEncoding The incoming Request's 'accept-encoding' header.
 * @returns A Response object for the file, or undefined if the base file doesn't exist or is not a file.
 */
export const serveCompressed = async (
  filePath: string | null,
  acceptEncoding: string
): Promise<Response | undefined> => {
  if (!filePath) {
    return undefined;
  }
  const exists = await fsPromises.exists(filePath);
  if (!exists) {
    return undefined;
  }
  const isFile = await fsPromises.stat(filePath).then(stat => stat.isFile());
  if (!isFile) {
    return undefined;
  }

  const baseContentType = mime.getType(filePath) || 'application/octet-stream';

  // Helper function to attempt serving a specific compressed version
  const tryServeCompressedVersion = async (
    fileSuffix: string,
    encodingType: 'br' | 'gzip'
  ): Promise<Response | undefined> => {
    const compressedFilePath = filePath + fileSuffix;
    if (acceptEncoding.includes(encodingType) && (await fsPromises.exists(compressedFilePath))) {
      return new Response(Bun.file(compressedFilePath), {
        headers: {
          'Content-Encoding': encodingType,
          'Content-Type': baseContentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
    return undefined;
  };

  // Try Brotli first, as it generally offers better compression
  const brotliResponse = await tryServeCompressedVersion('.br', 'br');
  if (brotliResponse) {
    console.log(`serving brotli! ${filePath}`);
    return brotliResponse;
  }

  // Then try Gzip
  const gzipResponse = await tryServeCompressedVersion('.gz', 'gzip');
  if (gzipResponse) {
    console.log(`serving gzip! ${filePath}`);
    return gzipResponse;
  }

  // Fallback to serving the uncompressed file
  return new Response(Bun.file(filePath), {
    headers: {
      'Content-Type': baseContentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

export const safeJoin = (root: string, requestPath: string) => {
  const relativeRequestPath = requestPath.startsWith('/') ? requestPath.substring(1) : requestPath;
  const fullPath = path.normalize(path.join(root, relativeRequestPath));
  if (!fullPath.startsWith(root)) {
    // tried to break out of root
    return null;
  }
  return fullPath;
};
