import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const indentName = (name: string, level: number, indent?: number) =>
  `${" ".repeat(indent ? indent : (level - 1) * 6)}${name}`;

async function downloadWorkbook(workbook: ExcelJS.Workbook, filename: string) {
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), filename);
}

export async function exportUploadBranch(ca: any[], add: any[]) {
  const workbook = new ExcelJS.Workbook();

  const template = workbook.addWorksheet("Template");

  template.columns = [
    { header: "ID", key: "id", width: 12 },
    { header: "Client", key: "client", width: 12 },
    { header: "Branch Code", key: "bcode", width: 18 },
    { header: "Branch Name", key: "bname", width: 18 },
    { header: "Contact Person", key: "cperson", width: 18 },
    { header: "Contact No", key: "cno", width: 18 },
    { header: "Email", key: "email", width: 18 },
    { header: "Block No", key: "blockno", width: 12 },
    { header: "Building Subdivision", key: "buildingsub", width: 12 },
    { header: "Street", key: "street", width: 15 },
    { header: "Barangay Id", key: "barangayid", width: 12 },
    { header: "Barangay Name", key: "barangayname", width: 25 },
    { header: "City", key: "city", width: 18 },
  ];

  template.getRow(1).font = { bold: true };
  template.getCell("A1").note = "Client ID based on the `Client` sheet.";
  template.getCell("B1").note = "Automatic based on the Client ID inputted.";
  template.getCell("C1").note = "Input Branch Code.";
  template.getCell("D1").note = "Input Branch Name.";
  template.getCell("E1").note = "Input Contact Person.";
  template.getCell("F1").note = "Input Contact No.";
  template.getCell("G1").note = "Input Email.";
  template.getCell("H1").note = "Input Block No / Unit No.";
  template.getCell("I1").note = "Input Building Subdivision.";
  template.getCell("J1").note = "Input Street";
  template.getCell("K1").note = "Input Barangay ID";
  template.getCell("L1").note = "Automatic Based on the Barangay ID inputted";
  template.getCell("M1").note = "Input City";

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
    template.getCell(`L${row}`).value = {
      formula: `
      IF(K${row}<>"",
        IFERROR(TRIM(VLOOKUP(K${row}, Address!A:E, 5, FALSE)), ""),
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

  const cust = workbook.addWorksheet("Address");

  cust.columns = [
    { header: "ID", key: "id", width: 8 },
    { header: "Region", key: "region", width: 15 },
    { header: "Province", key: "province", width: 18 },
    { header: "City", key: "city", width: 18 },
    { header: "Barangay", key: "barangay", width: 18 },
  ];

  add.map((item: any) => {
    cust.addRow([
      item.id,
      item.region,
      item.province,
      item.city,
      item.barangay,
    ]);
  });

  await downloadWorkbook(workbook, "Upload_Branch_Template.xlsx");
}
