import fsPromises from 'fs/promises';
import mime from 'mime';
import path from 'path';
import crypto from 'crypto';
import { getStaticFileHeaders } from './headers';

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
      const headers = {
        'Content-Encoding': encodingType,
        ...getStaticFileHeaders(baseContentType, true),
      };
      return new Response(Bun.file(compressedFilePath), { headers });
    }
    return undefined;
  };

  // Try Brotli first, as it generally offers better compression
  const brotliResponse = await tryServeCompressedVersion('.br', 'br');
  if (brotliResponse) {
    return brotliResponse;
  }

  // Then try Gzip
  const gzipResponse = await tryServeCompressedVersion('.gz', 'gzip');
  if (gzipResponse) {
    return gzipResponse;
  }

  // Fallback to serving the uncompressed file
  return new Response(Bun.file(filePath), {
    headers: getStaticFileHeaders(baseContentType, true),
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

/**
 * Serves a file with conditional request support (ETag and If-Modified-Since)
 * @param req The incoming request
 * @param filePath The path to the file to serve
 * @param contentType The content type of the file
 * @returns A Response object with appropriate headers and status code
 */
export const serveWithConditionalHeaders = async (
  req: Request,
  filePath: string,
  contentType: string
): Promise<Response> => {
  const fileStats = await fsPromises.stat(filePath);
  const lastModified = new Date(fileStats.mtime).toUTCString();
  const fileContent = await fsPromises.readFile(filePath);
  const etag = crypto.createHash('md5').update(fileContent).digest('hex');

  // Check if-none-match header
  const ifNoneMatch = req.headers.get('if-none-match');
  if (ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        'Last-Modified': lastModified,
        ...getStaticFileHeaders(contentType),
      },
    });
  }

  // Check if-modified-since header
  const ifModifiedSince = req.headers.get('if-modified-since');
  if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(lastModified)) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        'Last-Modified': lastModified,
        ...getStaticFileHeaders(contentType),
      },
    });
  }

  // Return the full response with appropriate headers
  return new Response(fileContent, {
    headers: {
      ETag: etag,
      'Last-Modified': lastModified,
      ...getStaticFileHeaders(contentType),
    },
  });
};
