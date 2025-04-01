import { MyAccountService } from '@/api/services/MyAccountService';
import { useMutation } from '@tanstack/react-query';
import { WECODownloadDocRequest } from '@/api/models/WECODownloadDocRequest';
import * as XLSX from 'xlsx';

const useDownloadXlsx = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: WECODownloadDocRequest) => {
      // Ensure the response is in arraybuffer or blob format
      const response = await MyAccountService.myAccountDownloadDoc(data);
      return response as ArrayBuffer; // Ensure response type is correct
    },
    onSuccess: (data) => {
      // Parse CSV data
      // Read the workbook
      const workbook = XLSX.read(data, { type: 'string', codepage: 65001, raw: true });

      // Get the worksheet from the first sheet
      const jsonSheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
        header: 1,
      }) as unknown[][];

      // Convert to worksheet
      const worksheet = XLSX.utils.aoa_to_sheet(jsonSheetData);

      // Create a new workbook and add the worksheet
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Sheet1');

      // Generate XLSX file as binary string
      const xlsxBinaryString = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'binary' });

      // Convert binary string to array buffer
      const arrayBuffer = new ArrayBuffer(xlsxBinaryString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < xlsxBinaryString.length; i++) {
        uint8Array[i] = xlsxBinaryString.charCodeAt(i) & 0xff;
      }

      // Create a blob from the array buffer
      const blob = new Blob([arrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create an object URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.xlsx';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Download failed:', error);
    },
  });

  return { mutate, isPending };
};

export default useDownloadXlsx;
