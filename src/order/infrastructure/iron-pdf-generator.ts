import { PdfGeneratorInterface } from 'src/order/domain/port/pdf-generator.interface';
import {PdfDocument} from "@ironsoftware/ironpdf";

export class IronPdfGenerator implements PdfGeneratorInterface {
  async generateInvoicePdf(details : string) {
	  const pdf = await PdfDocument.fromHtml(details);
    await pdf.saveAs("export.pdf");
  }
}
