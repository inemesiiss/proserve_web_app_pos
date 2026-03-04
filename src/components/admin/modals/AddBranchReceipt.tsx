import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddBranchReceiptMutation,
  useGetReceiptBranchQuery,
  useGetReceiptFooterQuery,
} from "@/store/api/Admin";
import { toast } from "sonner";
import YesNoDropdown from "@/components/reusables/YesNoDropdown";

interface AddBranchReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AccountFormData) => void;
  type: number;
  setType: React.Dispatch<React.SetStateAction<number>>;
  data?: any;
  name: string;
  cname: string;
  id: string;
}

interface AccountFormData {
  id: string;
  client: string;
  branch: string;
  address: string;
  vat_reg_tin: string;
  vat_reg_date: string;
  min: string;
  t_discount: string;
  t_vat_sales: string;
  t_vat_twelve: string;
  t_vat_exempt: string;
  t_total: string;
  t_cash: string;
  t_change: string;
  t_total_items: string;
  t_invoice: string;
  t_cashier: string;
  t_order_no: string;
  t_date_time: string;
  l_name: string;
  l_address: string;
  l_tin: string;
  l_bus_style: string;
  qr_image: string | File;
}

export type IdName = {
  id: number;
  name: string;
};

const getVal = (e: boolean) => {
  if (e) {
    return "1";
  } else {
    return "2";
  }
};

export default function AddBranchReceiptModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  setType,
  data,
  name,
  cname,
  id,
}: AddBranchReceiptProps) {
  const initial = {
    id: "0",
    client: id,
    branch: "",
    address: "",
    vat_reg_tin: "",
    vat_reg_date: "",
    min: "",
    t_discount: "1",
    t_vat_sales: "1",
    t_vat_twelve: "1",
    t_vat_exempt: "1",
    t_total: "1",
    t_cash: "1",
    t_change: "1",
    t_total_items: "1",
    t_invoice: "1",
    t_cashier: "1",
    t_order_no: "1",
    t_date_time: "1",
    l_name: "1",
    l_address: "1",
    l_tin: "1",
    l_bus_style: "1",
    qr_image: "",
  };

  const apiDomain = import.meta.env.VITE_API_DOMAIN;
  const [formData, setFormData] = useState<AccountFormData>(initial);
  const [counter, setCounter] = useState(0);

  const [qrPreview, setQrPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    submitAccount();
    //   handleClose();
  };

  const handleClose = () => {
    setFormData(initial);
    setType(1);
    onClose();
  };

  // const handlelogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const input = e.target;
  //   const file = input.files?.[0];

  //   if (!file) return;

  //   // Validate size
  //   if (file.size > 1 * 1024 * 1024) {
  //     toast.error("File must be 1MB or less.");
  //     input.value = ""; // reset so selecting same file triggers change
  //     return;
  //   }

  //   setFormData({ ...formData, logo: file });

  //   // Reset after successful upload too (optional)
  //   // input.value = "";
  // };

  const handleChange = (field: keyof AccountFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error("Image must be 1MB or less.");
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setQrPreview(previewUrl);
    setFormData({ ...formData, qr_image: file });

    // OPTIONAL: if you want to submit this later
    // setFormData(prev => ({ ...prev, logo: file }));

    // Allow re-selecting same file
    e.target.value = "";
  };

  const triggerQrUpload = () => {
    fileInputRef.current?.click();
  };

  const getRfooter = useGetReceiptFooterQuery({});

  const getCR = useGetReceiptBranchQuery(
    { id: data, count: counter },
    { skip: data === "0" },
  );

  useEffect(() => {
    if (getCR.isSuccess && getCR.data) {
      console.log("CR: ", getCR?.data?.data);
      data = getCR?.data?.data;
      setFormData({
        id: "0",
        client: id,
        branch: "",
        address: data?.address,
        vat_reg_tin: data?.vat_reg_tin,
        vat_reg_date: data?.vat_reg_date,
        min: data?.min,
        t_discount: getVal(data?.t_discount),
        t_vat_sales: getVal(data?.t_vat_sales),
        t_vat_twelve: getVal(data?.t_vat_twelve),
        t_vat_exempt: getVal(data?.t_vat_exempt),
        t_total: getVal(data?.t_total),
        t_cash: getVal(data?.t_cash),
        t_change: getVal(data?.t_change),
        t_total_items: getVal(data?.t_total_items),
        t_invoice: getVal(data?.t_invoice),
        t_cashier: getVal(data?.t_cashier),
        t_order_no: getVal(data?.t_order_no),
        t_date_time: getVal(data?.t_date_time),
        l_name: getVal(data?.l_name),
        l_address: getVal(data?.l_address),
        l_tin: getVal(data?.l_tin),
        l_bus_style: getVal(data?.l_bus_style),
        qr_image: data?.qr_image,
      });

      if (data?.qr_image) {
        setQrPreview(apiDomain + data?.qr_image);
      }
    }
  }, [getCR.isSuccess, getCR.data]);

  // Load the account data only once when modal opens or when "data" changes
  useEffect(() => {
    if (isOpen) {
      setCounter((prev) => prev + 1);
      setFormData(initial);
      setQrPreview("");
    }
  }, [isOpen]);

  const [addClient] = useAddBranchReceiptMutation();
  const submitAccount = async () => {
    try {
      const formData1 = new FormData();
      formData1.append("datas", JSON.stringify(formData));
      formData1.append("bid", id);
      formData1.append("rid", data);
      if (formData.qr_image) {
        formData1.append("logo", formData.qr_image);
      }

      const checkstat = await addClient(formData1).unwrap();

      if (checkstat.success) {
        handleClose();
        toast.success("Successfully Added.");
      } else {
        toast.error(checkstat.message);
      }

      console.log(checkstat);
    } catch (error) {}
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

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 py-1 ">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {/* {type === 2 ? `Update` : `Add New`} Account */}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4 ">
                {/* Client Name */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 overflow-y-auto max-h-[70vh]">
                  <div className="grid max-w-lg items-center gap-1 ">
                    <Label htmlFor="date">Client</Label>
                    <Input
                      type="text"
                      placeholder="Account Name"
                      value={cname}
                      // onChange={(e) => handleChange("client", e.target.value)}
                      readOnly
                    />
                  </div>

                  <div className="grid max-w-lg items-center gap-1 ">
                    <Label htmlFor="date">Branch</Label>
                    <Input
                      type="text"
                      placeholder="Account Name"
                      value={name}
                      readOnly
                    />
                  </div>

                  <div className="grid max-w-lg items-center gap-1 ">
                    <Label htmlFor="date">Address</Label>
                    <textarea
                      placeholder="Address"
                      className="border p-1"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </div>

                  <div className="grid max-w-lg items-center gap-1 ">
                    <Label htmlFor="date">VAT Reg TIN</Label>
                    <Input
                      type="text"
                      placeholder="VAT Reg TIN"
                      value={formData.vat_reg_tin}
                      onChange={(e) =>
                        handleChange("vat_reg_tin", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid max-w-lg items-center gap-1 ">
                    <Label htmlFor="date">VAT Reg Date</Label>
                    <Input
                      type="text"
                      placeholder="VAT Reg Date"
                      value={formData.vat_reg_date}
                      onChange={(e) =>
                        handleChange("vat_reg_date", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid max-w-lg items-center gap-1 ">
                    <Label htmlFor="date">MIN</Label>
                    <Input
                      type="text"
                      placeholder="MIN"
                      value={formData.min}
                      onChange={(e) => handleChange("min", e.target.value)}
                    />
                  </div>

                  <hr />

                  <div className="space-y-2">
                    <YesNoDropdown
                      title="Discount"
                      val={formData.t_discount}
                      func={(e) => handleChange("t_discount", e)}
                    />

                    <YesNoDropdown
                      title="VAT Sales"
                      val={formData.t_vat_sales}
                      func={(e) => handleChange("t_vat_sales", e)}
                    />

                    <YesNoDropdown
                      title="VAT (12%)"
                      val={formData.t_vat_twelve}
                      func={(e) => handleChange("t_vat_twelve", e)}
                    />

                    <YesNoDropdown
                      title="VAT Exempt Sales"
                      val={formData.t_vat_exempt}
                      func={(e) => handleChange("t_vat_exempt", e)}
                    />

                    <YesNoDropdown
                      title="Total"
                      val={formData.t_total}
                      func={(e) => handleChange("t_total", e)}
                    />

                    <YesNoDropdown
                      title="Cash"
                      val={formData.t_cash}
                      func={(e) => handleChange("t_cash", e)}
                    />

                    <YesNoDropdown
                      title="Change"
                      val={formData.t_change}
                      func={(e) => handleChange("t_change", e)}
                    />

                    <YesNoDropdown
                      title="TOTAL ITEM(S)"
                      val={formData.t_total_items}
                      func={(e) => handleChange("t_total_items", e)}
                    />

                    <YesNoDropdown
                      title="INV #"
                      val={formData.t_invoice}
                      func={(e) => handleChange("t_invoice", e)}
                    />

                    <YesNoDropdown
                      title="CASHIER"
                      val={formData.t_cashier}
                      func={(e) => handleChange("t_cashier", e)}
                    />

                    <YesNoDropdown
                      title="Order #"
                      val={formData.t_order_no}
                      func={(e) => handleChange("t_order_no", e)}
                    />

                    <YesNoDropdown
                      title="Date and Time"
                      val={formData.t_date_time}
                      func={(e) => handleChange("t_date_time", e)}
                    />

                    <hr className="my-6" />

                    <YesNoDropdown
                      title="Name"
                      val={formData.l_name}
                      func={(e) => handleChange("l_name", e)}
                    />

                    <YesNoDropdown
                      title="Address"
                      val={formData.l_address}
                      func={(e) => handleChange("l_address", e)}
                    />

                    <YesNoDropdown
                      title="TIN No."
                      val={formData.l_tin}
                      func={(e) => handleChange("l_tin", e)}
                    />

                    <YesNoDropdown
                      title="Bus Style"
                      val={formData.l_bus_style}
                      func={(e) => handleChange("l_bus_style", e)}
                    />

                    <hr className="my-6" />

                    <div className="flex items-center flex-col space-y-2">
                      <span className="text-center w-full text-gray-700">
                        Scan for you feedback
                      </span>
                      <div
                        onClick={triggerQrUpload}
                        className="text-gray-500 border-dashed border-2 bg-indigo-50 w-56
             border-indigo-200 flex flex-col gap-2 justify-center
             items-center h-28 py-1 rounded-sm cursor-pointer
             text-sm hover:border-indigo-400 relative"
                      >
                        {qrPreview ? (
                          <img
                            src={qrPreview}
                            alt="QR Preview"
                            className="object-contain h-full w-full p-2"
                          />
                        ) : (
                          <>
                            <CloudUpload size={40} />
                            <span className="text-xs">
                              Upload QR Code Image
                            </span>
                          </>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleQrUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <hr className="my-6" />

                    <div className="flex flex-col">
                      <span className="w-full text-center font-bold">
                        {getRfooter?.data?.data?.line_1}
                      </span>
                      <span className="w-full text-center text-gray-800">
                        {getRfooter?.data?.data?.line_2}
                      </span>
                      <span className="w-full text-center text-gray-800">
                        {getRfooter?.data?.data?.line_3}
                      </span>
                      <span className="w-full text-center text-gray-800">
                        {getRfooter?.data?.data?.line_4}
                      </span>
                      <span className="w-full text-center text-gray-800">
                        {getRfooter?.data?.data?.line_5}
                      </span>
                      <span className="w-full text-center text-gray-800">
                        {getRfooter?.data?.data?.line_6}
                      </span>
                      <span className="w-full text-center text-gray-800">
                        {getRfooter?.data?.data?.line_7}
                      </span>
                      <span className="w-full text-center text-gray-800">
                        {getRfooter?.data?.data?.line_8}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    {type === 2 || data !== "0"
                      ? `Update Receipt`
                      : `Add Receipt`}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
