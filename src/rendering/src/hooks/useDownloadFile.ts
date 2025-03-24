import { useEffect, useState } from 'react';
import { DOCUMNETTYPE, DOWNLOADBASEURL } from '@/utils/constants';
import { WECODownloadDocRequest } from '@/api/models/WECODownloadDocRequest';
import { OpenAPI } from '@/api/core/OpenAPI';

interface FileType {
  type: string; // MIME type
  extension: string; // File extension
}

const getFileType = (downloadType: DOCUMNETTYPE): FileType => {
  switch (downloadType) {
    case DOCUMNETTYPE.PDF:
      return { type: 'application/pdf', extension: 'pdf' };
    case DOCUMNETTYPE.XLSX:
      return {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: 'xlsx',
      };
    case DOCUMNETTYPE.XLS:
      return { type: 'application/vnd.ms-excel', extension: 'xls' };
    case DOCUMNETTYPE.CSV:
      return { type: 'text/csv', extension: 'csv' };
    case DOCUMNETTYPE.TEXT:
      return { type: 'text/plain', extension: 'txt' };
    case DOCUMNETTYPE.XML:
      return { type: 'application/xml', extension: 'xml' };
    default:
      throw new Error('Unsupported file type');
  }
};

const getFilenameFromContentDisposition = (contentDisposition: string | null): string => {
  if (!contentDisposition) return 'document';

  const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (filenameMatch && filenameMatch[1]) {
    return filenameMatch[1].replace(/['"]/g, ''); // Remove quotes if present
  }
  return 'document';
};

const useDownloadFile = () => {
  const [isPending, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isError) {
      timeoutId = setTimeout(() => {
        setIsError(false);
      }, 10000);
    }

    return () => clearTimeout(timeoutId);
  }, [isError]);

  const mutate = async (data: WECODownloadDocRequest) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const response = await fetch(`${OpenAPI.BASE}${DOWNLOADBASEURL}`, {
        method: 'POST',
        headers: {
          ...OpenAPI.HEADERS,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Ensure the response is in ArrayBuffer format
      const arrayBuffer = await response.arrayBuffer();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = getFilenameFromContentDisposition(contentDisposition);

      const fileType = getFileType(data.downloadType as DOCUMNETTYPE);

      // Convert ArrayBuffer to Blob
      const blob = new Blob([arrayBuffer], { type: fileType.type });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      setIsError(true);
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isPending, isError };
};

export default useDownloadFile;
