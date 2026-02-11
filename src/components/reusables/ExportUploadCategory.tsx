import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

async function downloadWorkbook(workbook: ExcelJS.Workbook, filename: string) {
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), filename);
}

export async function exportUploadCategory(ca: any[]) {
  const workbook = new ExcelJS.Workbook();

  const template = workbook.addWorksheet("Template");

  template.columns = [
    { header: "ID", key: "id", width: 12 },
    { header: "Client", key: "client", width: 12 },
    { header: "Name", key: "name", width: 18 },
  ];

  template.getRow(1).font = { bold: true };
  template.getCell("A1").note = "Client ID based on the `Client` sheet.";
  template.getCell("B1").note = "Automatic based on the Client ID inputted.";
  template.getCell("C1").note = "Input Category Name.";

  for (let row = 2; row <= 1000; row++) {
    template.getCell(`B${row}`).value = {
      formula: `
      IF(A${row}<>"",
        IFERROR(TRIM(VLOOKUP(A${row}, Clients!A:B, 2, FALSE)), ""),
          ""
      )
    `.replace(/\s+/g, " "),
    };
  }

  const sheet = workbook.addWorksheet("Clients");

  sheet.columns = [
    { header: "ID", key: "id", width: 12 },
    { header: "Name", key: "name", width: 70 },
  ];

  ca.map((item: any) => {
    sheet.addRow([item.id, item.name]);
  });

  await downloadWorkbook(workbook, "Upload_Category_Template.xlsx");
}
