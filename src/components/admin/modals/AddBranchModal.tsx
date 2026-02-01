import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddBranchMutation,
  useGetAllBranchQuery,
  useGetClientsQuery,
  useUpBranchMutation,
} from "@/store/api/Admin";
import type { IdName } from "./AddAccountModal";
import Barangay from "@/components/reusables/Barangay";
import { toast } from "sonner";

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BranchFormData) => void;
  type: number;
  data?: any;
  count?: number;
  setType: React.Dispatch<React.SetStateAction<number>>;
}

type bpAddress = {
  regionId: number;
  provinceId: number;
  cityId: number;
  barangayId: number;
  barangayName: string;
  cityName: string;
};

interface BranchFormData {
  id: number;
  client: number | string;
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

export default function AddBranchModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  data,
  setType,
}: AddBranchModalProps) {
  console.log("Data: ", data);
  const initial = {
    id: 0,
    client: 0,
    code: "",
    name: "",
    block_no: "",
    subdivision: "",
    street: "",
    barangay: 0,
    contact_person: "",
    contact_no: "",
    email: "",
    status: 1,
    bp_address: {
      regionId: 0,
      provinceId: 0,
      cityId: 0,
      barangayId: 0,
      barangayName: "",
      cityName: "",
    },
  };
  const [formData, setFormData] = useState<BranchFormData>(initial);
  const [client, setClient] = useState<IdName[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    submitBranch();
    // handleClose();
  };

  const handleClose = () => {
    setFormData({
      id: 0,
      client: 0,
      code: "",
      name: "",
      block_no: "",
      subdivision: "",
      street: "",
      barangay: 0,
      contact_person: "",
      contact_no: "",
      email: "",
      status: 1,
      bp_address: {
        regionId: 0,
        provinceId: 0,
        cityId: 0,
        barangayId: 0,
        barangayName: "",
        cityName: "",
      },
    });
    setType(1);
    onClose();
  };

  const getBranchDropdown = useGetAllBranchQuery(
    { cid: formData.client },
    { skip: formData.client === 0 },
  );
  useEffect(() => {
    if (getBranchDropdown.isSuccess && getBranchDropdown.data) {
      const selected = client.find(
        (c) => String(c.id) === String(formData.client),
      );
      const prefix = selected
        ? selected.name.substring(0, 3).toUpperCase()
        : "";
      const newCode = `${prefix}-${String(
        getBranchDropdown.data.data.length + 1,
      ).padStart(3, "0")}`;

      setFormData((prev) => ({
        ...prev,
        code: newCode,
      }));
    }
  }, [getBranchDropdown.isSuccess, getBranchDropdown.data]);

  const handleChange = (field: keyof BranchFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getClientDropdown = useGetClientsQuery({});
  useEffect(() => {
    if (getClientDropdown.isSuccess && getClientDropdown.data) {
      setClient(getClientDropdown.data.data);
    }
  }, [getClientDropdown.isSuccess, getClientDropdown.data]);

  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        id: data.id,
        client: String(data.client),
        code: data.code,
        name: data.name,
        block_no: data.block_no,
        subdivision: data.subdivision,
        street: data.street,
        barangay: data.barangay,
        contact_person: data.contact_person,
        contact_no: data.contact_no,
        email: data.email,
        status: data.status,
        bp_address: {
          regionId: data.bp_address.regionId,
          provinceId: data.bp_address.provinceId,
          cityId: data.bp_address.cityId,
          barangayId: data.bp_address.barangayId,
          barangayName: data.bp_address.barangayName,
          cityName: data.bp_address.cityName,
        },
      });
    }
  }, [data, isOpen]);

  const [addBranch] = useAddBranchMutation();
  const [upBranch] = useUpBranchMutation();
  const submitBranch = async () => {
    if (type === 1) {
      if (formData.name !== "") {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));

          const checkstat = await addBranch(formData1).unwrap();

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
      if (formData.name !== "") {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));
          formData1.append("bid", String(formData.id));

          const checkstat = await upBranch(formData1).unwrap();
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
                  {type === 1 ? `Add New` : `Update`} Branch
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
                    <Label htmlFor="date">Client Name</Label>
                    <Select
                      value={String(formData.client)}
                      onValueChange={(value) => {
                        handleChange("client", value);
                      }}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {client?.map((item: IdName, index: number) => (
                          <SelectItem key={index} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Branch Code</Label>
                    <Input
                      type="text"
                      placeholder="Branch Code"
                      value={formData.code}
                      onChange={(e) => handleChange("code", e.target.value)}
                      readOnly
                    />
                  </div>
                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Branch Name</Label>
                    <Input
                      type="text"
                      placeholder="Branch Name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>
                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Contact Person</Label>
                    <Input
                      type="text"
                      placeholder="Contact Person"
                      value={formData.contact_person}
                      onChange={(e) =>
                        handleChange("contact_person", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Contact Number</Label>
                    <Input
                      type="text"
                      placeholder="Contact Number"
                      value={formData.contact_no}
                      onChange={(e) =>
                        handleChange("contact_no", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Email</Label>
                    <Input
                      type="text"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Block No / Unit No</Label>
                    <Input
                      type="text"
                      placeholder="Block No / Unit No"
                      value={formData.block_no}
                      onChange={(e) => handleChange("block_no", e.target.value)}
                    />
                  </div>
                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Building Subdivision</Label>
                    <Input
                      type="text"
                      placeholder="Building Subdivision"
                      value={formData.subdivision}
                      onChange={(e) =>
                        handleChange("subdivision", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Street</Label>
                    <Input
                      type="text"
                      placeholder="Street"
                      value={formData.street}
                      onChange={(e) => handleChange("street", e.target.value)}
                    />
                  </div>
                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Barangay</Label>
                    {/* <Input type="text" placeholder="Barangay" /> */}
                    <Barangay
                      value={formData.bp_address}
                      onChange={(val) => {
                        setFormData({
                          ...formData,
                          barangay: val.barangayId,
                          bp_address: val,
                        });
                      }}
                    />
                  </div>
                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">City</Label>
                    <Input
                      type="text"
                      placeholder="City"
                      value={formData.bp_address.cityName}
                      readOnly
                    />
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
                    {type === 1 ? `Add` : `Update`} Branch
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
