declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[] | [number, number] | [number, number, number, number];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      logging?: boolean;
      letterRendering?: boolean;
      allowTaint?: boolean;
      backgroundColor?: string;
      scrollX?: number;
      scrollY?: number;
      [key: string]: any;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
      [key: string]: any;
    };
    pagebreak?: {
      [key: string]: any;
    };
    [key: string]: any;
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf;
    from(element: HTMLElement | string): Html2Pdf;
    outputPdf(type?: 'blob' | 'arraybuffer' | 'string'): Promise<Blob>;
    save(): Promise<void>;
  }

  function html2pdf(): Html2Pdf;

  export default html2pdf;
}
