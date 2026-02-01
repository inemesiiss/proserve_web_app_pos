import CustomDialog from "@/components/reusables/CustomDialog";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useRef, useState } from "react";

import Papa from "papaparse";
import ExcelJS from "exceljs";
import {
  useAddBranchMutation,
  useAddBranchTemplateMutation,
  useAddClientProductTemplateMutation,
  useGetAddressExcelQuery,
  useGetBranchExcelQuery,
  useGetCategoryExcelQuery,
  useGetClientExcelQuery,
} from "@/store/api/Admin";
import { exportUploadBranch } from "@/components/reusables/ExportUploadBranch";
import { toast } from "sonner";
import { exportUploadProduct } from "@/components/reusables/ExportUploadProduct";

interface UploadBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BranchFormData) => void;
  type: number;
  data?: any;
  count?: number;
}

interface BranchFormData {
  id: number;
  client: number;
  code: string;
  name: string;
  block_no: string;
  subdivision: string;
  street: string;
  barangay: number;
  contact_person: string;
  contact_no: string;
  email: string;
  status: number;
  bp_address: bpAddress;
}

type bpAddress = {
  regionId: number;
  provinceId: number;
  cityId: number;
  barangayId: number;
  barangayName: string;
  cityName: string;
};

export default function UploadProductModal({
  isOpen,
  onClose,
  onSubmit,
  type,
}: UploadBranchModalProps) {
  console.log(isOpen);

  const handleClose = () => {
    // setFormData(initial);
    onClose();
  };

  const getClientExcel = useGetClientExcelQuery({});
  const getBranchExcel = useGetBranchExcelQuery({});
  const getCategoryExcel = useGetCategoryExcelQuery({});

  const [uploadTemplate, setUploadTemplate] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const normalizeHeader = (header: string) =>
    header.toLowerCase().trim().replace(/\s+/g, "_");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // -------- CSV --------
    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setUploadTemplate(result.data as any[]);
          console.log("CSV JSON:", result.data);
        },
      });
      return;
    }

    // -------- EXCEL (.xlsx / .xls) --------
    if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());

      const worksheet = workbook.worksheets[0];
      const rows: any[] = [];
      let headers: string[] = [];

      worksheet.eachRow((row, rowNumber) => {
        const values = row.values as any[];

        if (rowNumber === 1) {
          headers = values.slice(1).map((h) => normalizeHeader(String(h)));
          return;
        }

        const rowObject: any = {};
        headers.forEach((header, index) => {
          rowObject[header] = values[index + 1] ?? "";
        });

        const hasCost =
          rowObject.product_cost !== "" && rowObject.product_cost != null;
        const hasName = rowObject.name !== "" && rowObject.name != null;

        if (hasCost && hasName) {
          rows.push(rowObject);
        }
      });

      setUploadTemplate(rows);
      console.log("Excel JSON:", rows);
    }
  };

  const [addProduct] = useAddClientProductTemplateMutation();
  const submitData = async () => {
    try {
      const formData1 = new FormData();
      formData1.append("datas", JSON.stringify(uploadTemplate));

      const checkstat = await addProduct(formData1).unwrap();

      if (checkstat.success) {
        handleClose();
        toast.success("Successfully Added.");
      } else {
        toast.error(checkstat.message);
      }

      console.log(checkstat);
    } catch (error) {}

    // setOpenUpload(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-7xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Upload Product
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="flex flex-col py-2 gap-4 p-6">
                <div className="flex justify-between pt-2">
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".csv,.xlsx,.xls"
                      hidden
                      onChange={handleFileSelect}
                    />
                    <Button
                      variant="primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Import Excel
                    </Button>
                  </div>

                  <div className="flex items-center">
                    {uploadTemplate && uploadTemplate.length === 0 && (
                      <Button
                        variant="link"
                        className="text-blue-600 underline"
                        onClick={async () => {
                          await exportUploadProduct(
                            getClientExcel?.data?.data,
                            getBranchExcel?.data?.data,
                            getCategoryExcel?.data?.data,
                          );
                        }}
                      >
                        Download Template
                      </Button>
                    )}
                    {uploadTemplate.length > 0 && (
                      <Button variant={"second"} onClick={submitData}>
                        Upload
                      </Button>
                    )}
                  </div>
                </div>

                <div className="max-h-[70vh] min-h-[70vh] overflow-auto">
                  <table className="w-full ">
                    <tr>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Client
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Branch
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Category
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Product Name
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        UOM
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Size/Option
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Price
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Product Cost
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Vatable
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Barcode
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Purchase Type
                      </td>
                      <td className="p-1 font-medium border border-black bg-gray-300">
                        Has Variants
                      </td>
                    </tr>

                    {uploadTemplate.map((item: any, index) => (
                      <tr key={index}>
                        <td className="p-1 border border-black">
                          {
                            getClientExcel?.data?.data.find(
                              (item1: any) => item?.id === item1.id,
                            ).name
                          }
                        </td>
                        <td className="p-1 border border-black">
                          {item?.branch_code}
                        </td>
                        <td className="p-1 border border-black">
                          {item?.branch_name}
                        </td>
                        <td className="p-1 border border-black">
                          {item?.contact_person}
                        </td>
                        <td className="p-1 border border-black">
                          {item?.contact_no}
                        </td>
                        <td className="p-1 border border-black">
                          {item?.email?.text ?? item?.email}
                        </td>
                        <td className="p-1 border border-black">
                          {item?.block_no}
                        </td>
                        <td className="p-1 border border-black">
                          {item?.building_subdivision}
                        </td>
                        <td className="p-1 border border-black">
                          {item?.street}
                        </td>
                        <td className="p-1 border border-black">
                          {/* {
                            getAddressExcel?.data?.data?.find(
                              (item1: any) => item?.barangay_id === item1.id,
                            )?.barangay
                          } */}
                        </td>
                        <td className="p-1 border border-black">
                          {item?.city}
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
