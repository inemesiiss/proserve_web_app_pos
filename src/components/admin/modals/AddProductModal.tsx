import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddClientProductMutation,
  useGetAllBranchQuery,
  useGetAllCategoriesQuery,
  useGetClientsQuery,
  useUpClientProductMutation,
} from "@/store/api/Admin";
import type { IdName } from "./AddAccountModal";
import { ComboBox } from "@/components/reusables/Barangay";
import { toast } from "sonner";
import { ComboBoxCheck } from "@/components/reusables/ComboBoxCheck";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ProductFormData) => void;
  type: number;
  setType: React.Dispatch<React.SetStateAction<number>>;
  data?: any;
}

interface ProductFormData {
  id: number;
  client: number;
  branch: number[];
  prod_categ: number;
  prod_name: string;
  prod_size: string;
  uom: string;
  price: string;
  tax: string;
  cost: string;
  image: string | File;
  prod_code: string;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  setType,
  data,
}: AddProductModalProps) {
  const apiDomain = import.meta.env.VITE_API_DOMAIN;
  console.log("Data here: ", data);

  const initial = {
    id: 0,
    client: 0,
    branch: [],
    prod_categ: 0,
    prod_name: "",
    prod_size: "",
    uom: "",
    price: "",
    tax: "1",
    cost: "",
    image: "",
    prod_code: "",
  };
  const [formData, setFormData] = useState<ProductFormData>(initial);
  const [client, setClient] = useState<IdName[]>([]);
  const [branch, setBranch] = useState<IdName[]>([]);
  const [categ, setCateg] = useState<IdName[]>([]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    submitProduct();
    // handleClose();
  };

  const handleClose = () => {
    setFormData(initial);
    setType(1);
    onClose();
  };

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlelogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });

      // Generate preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const getClientDropdown = useGetClientsQuery({});
  useEffect(() => {
    if (getClientDropdown.isSuccess && getClientDropdown.data) {
      setClient(getClientDropdown.data.data);
    }
  }, [getClientDropdown.isSuccess, getClientDropdown.data]);

  const getBranchDropdown = useGetAllBranchQuery(
    { cid: formData.client },
    { skip: formData.client === 0 }
  );
  useEffect(() => {
    if (getBranchDropdown.isSuccess && getBranchDropdown.data) {
      setBranch(getBranchDropdown.data.data);
    }
  }, [getBranchDropdown.isSuccess, getBranchDropdown.data]);

  const getCategories = useGetAllCategoriesQuery(
    { id: formData.client },
    { skip: formData.client === 0 }
  );
  useEffect(() => {
    if (getCategories.isSuccess && getCategories.data) {
      setCateg(getCategories.data.data);
    }
  }, [getCategories.isSuccess, getCategories.data]);

  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        id: data.id,
        client: data.client,
        branch: Array.isArray(data.branch)
          ? data.branch
          : typeof data.branch === "string"
          ? data.branch.split(",").map(Number)
          : [],
        prod_categ: data.prod_categ,
        prod_name: data.prod_name,
        prod_size: data.prod_size,
        uom: data.uom,
        price: data.price,
        tax: data.tax,
        cost: data.cost,
        image: data.image,
        prod_code: data.prod_code,
      });
    }
  }, [data, isOpen]);

  const [addProduct] = useAddClientProductMutation();
  const [upProduct] = useUpClientProductMutation();
  const submitProduct = async () => {
    if (type === 1) {
      if (formData.prod_name !== "") {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));
          formData1.append("image", formData.image);
          formData1.append("branch", String(formData.branch));

          const checkstat = await addProduct(formData1).unwrap();

          if (checkstat.success) {
            handleClose();
            toast.success("Successfully Added.");
          } else {
            toast.error(checkstat.message);
          }

          console.log(checkstat);
        } catch (error) {}
      } else {
        toast.error("Please complete required fields.");
      }
    } else {
      if (formData.prod_name !== "") {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));
          formData1.append("image", formData.image);
          formData1.append("branch", String(formData.branch));

          const checkstat = await upProduct(formData1).unwrap();
          if (checkstat.success) {
            handleClose();
            toast.success("Successfully Updated.");
          } else {
            toast.error(checkstat.message);
          }
          console.log(checkstat);
        } catch (error) {}
      } else {
        toast.error("Please complete required fields.");
      }
    }
  };
  console.log("Client", formData.client);

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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {type === 1 ? `Add New` : `Update`} Product
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Client Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="client">Client</Label>
                    <ComboBox
                      label=""
                      openKey="client"
                      valueId={formData.client}
                      list={client || []}
                      onSelect={(id: string) => {
                        handleChange("client", id);
                      }}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="branch">Branch</Label>
                    <ComboBoxCheck
                      label=""
                      openKey="branch"
                      values={formData.branch}
                      list={branch || []}
                      onChange={(newArr: number[]) => {
                        handleChange("branch", newArr);
                      }}
                      disabled={formData.client === 0}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Product Category</Label>
                    <ComboBox
                      label=""
                      openKey="category"
                      valueId={formData.prod_categ}
                      list={categ || []}
                      onSelect={(id: string) => {
                        handleChange("prod_categ", id);
                      }}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Product Name</Label>
                    <Input
                      type="text"
                      placeholder="Product Name"
                      value={formData.prod_name}
                      onChange={(e) =>
                        handleChange("prod_name", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Unit of Measure</Label>
                    <Input
                      type="text"
                      placeholder="Unit of Measure"
                      value={formData.uom}
                      onChange={(e) => handleChange("uom", e.target.value)}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Size / Option</Label>
                    <Input
                      type="text"
                      placeholder="Size / Option"
                      value={formData.prod_size}
                      onChange={(e) =>
                        handleChange("prod_size", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Price</Label>
                    <Input
                      type="text"
                      placeholder="Price"
                      value={formData.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Product Cost</Label>
                    <Input
                      type="text"
                      placeholder="Product Cost"
                      value={formData.cost}
                      onChange={(e) => handleChange("cost", e.target.value)}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Vatable</Label>
                    <Select
                      value={
                        type === 1 ? String(formData.tax) : String(data.tax)
                      }
                      onValueChange={(value) => handleChange("tax", value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Choose One" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="2">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Barcode</Label>
                    <Input
                      type="text"
                      placeholder="Barcode"
                      value={formData.prod_code}
                      onChange={(e) =>
                        handleChange("prod_code", e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log("Scanned Code:", formData.prod_code);
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col max-w-md gap-1 ">
                    <Label htmlFor="date">Product Image</Label>
                    <Input type="file" onChange={handlelogoChange} />
                    {data?.image && (
                      <p className="text-sm text-gray-500 mt-1">
                        Current File:{" "}
                        <span className="font-medium">
                          {data.image.replace(
                            "/static/media/client_product/",
                            ""
                          )}
                        </span>
                      </p>
                    )}
                  </div>

                  {(data?.image !== "" || imagePreview) && (
                    <div className="flex flex-col max-w-md gap-1 ">
                      <Label htmlFor="date">Image Preview</Label>
                      {imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            className="w-20 h-20 object-cover rounded border"
                          />
                        </>
                      ) : type === 2 && data?.image ? (
                        <>
                          <img
                            src={apiDomain + data.image}
                            className="w-20 h-20 object-cover rounded border"
                          />
                        </>
                      ) : null}
                    </div>
                  )}
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
                    {type === 1 ? `Add` : `Update`} Product
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
