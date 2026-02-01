import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

async function downloadWorkbook(workbook: ExcelJS.Workbook, filename: string) {
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), filename);
}

export async function exportUploadProduct(cli: any[], brch: any[], cat: any[]) {
  const workbook = new ExcelJS.Workbook();

  const template = workbook.addWorksheet("Template");

  template.columns = [
    { header: "ID", key: "id", width: 12 },
    { header: "Client", key: "client", width: 12 },
    { header: "Branch", key: "branch", width: 18 },
    { header: "Category ID", key: "categoryid", width: 18 },
    { header: "Category Name", key: "categoryname", width: 18 },
    { header: "Name", key: "name", width: 18 },
    { header: "Unit of Measure", key: "uom", width: 18 },
    { header: "Size", key: "size", width: 18 },
    { header: "Price", key: "price", width: 12 },
    { header: "Product Cost", key: "cost", width: 12 },
    { header: "Vatable", key: "vatable", width: 15 },
    { header: "Barcode", key: "barcode", width: 12 },
    { header: "Purchase Type", key: "ptype", width: 25 },
    { header: "Has Variants", key: "variants", width: 18 },
  ];

  template.getRow(1).font = { bold: true };
  template.getCell("A1").note = "Client ID based on the `Clients` sheet.";
  template.getCell("B1").note = "Automatic based on the Client ID inputted.";
  template.getCell("C1").note =
    "0 = All branches. If specific branch, look the Branch ID on the `Branch` Sheet and input it separated by commas e.g.(1, 2, 3, 4)";
  template.getCell("D1").note =
    "Input Category ID based on the `Category` Sheet.";
  template.getCell("E1").note = "Automatic based on the Category ID inputted.";
  template.getCell("F1").note = "Input Product Name";
  template.getCell("G1").note = "Input Unit of Measurement.";
  template.getCell("H1").note = "Input size.";
  template.getCell("I1").note = "Input Product Price.";
  template.getCell("J1").note = "Input Product Cost.";
  template.getCell("K1").note = "`Y` - Yes, `N` - No";
  template.getCell("L1").note = "Input Barcode";
  template.getCell("M1").note = "`I` - Individual, `B` - Bundle";
  template.getCell("N1").note = "`Y` - Yes, `N` - No";

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

  for (let row = 2; row <= 1000; row++) {
    template.getCell(`E${row}`).value = {
      formula: `
      IF(D${row}<>"",
        IFERROR(TRIM(VLOOKUP(D${row}, Category!A:C, 3, FALSE)), ""),
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

  cli.map((item: any) => {
    sheet.addRow([item.id, item.name]);
  });

  const cust = workbook.addWorksheet("Branch");

  cust.columns = [
    { header: "ID", key: "id", width: 8 },
    { header: "Client", key: "client", width: 15 },
    { header: "Branch", key: "branch", width: 18 },
  ];

  brch.map((item: any) => {
    cust.addRow([item.id, item.client, item.name]);
  });

  const cate = workbook.addWorksheet("Category");

  cate.columns = [
    { header: "ID", key: "id", width: 8 },
    { header: "Client", key: "client", width: 15 },
    { header: "Category", key: "category", width: 18 },
  ];

  cat.map((item: any) => {
    cate.addRow([item.id, item.client, item.name]);
  });

  await downloadWorkbook(workbook, "Upload_Product_Template.xlsx");
}
