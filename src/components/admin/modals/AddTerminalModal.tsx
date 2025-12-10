import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddTerminalMutation,
  useGetAllBranchQuery,
  useGetClientsQuery,
  useUpTerminalMutation,
} from "@/store/api/Admin";
import type { IdName } from "./AddAccountModal";
import { ComboBox } from "@/components/reusables/Barangay";
import { toast } from "sonner";

interface AddTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: TerminalFormData) => void;
  type: number;
  setType: React.Dispatch<React.SetStateAction<number>>;
  data?: any;
}

interface TerminalFormData {
  id: number;
  client: number;
  branch: number;
  terminal_id: string;
  contract_term: string;
  start_date: string;
  end_date: string;
  renewal: string;
  status: number;
}

export default function AddTerminalModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  setType,
  data,
}: AddTerminalModalProps) {
  console.log("Data here: ", data);
  const initial = {
    id: 0,
    client: 0,
    branch: 0,
    terminal_id: "",
    contract_term: "",
    start_date: "",
    end_date: "",
    renewal: "",
    status: 1,
  };
  const [formData, setFormData] = useState<TerminalFormData>(initial);
  const [client, setClient] = useState<IdName[]>([]);
  const [branch, setBranch] = useState<IdName[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    submitTerminal();
    // handleClose();
  };

  const handleClose = () => {
    setFormData(initial);
    setType(1);
    onClose();
  };

  const handleChange = (field: keyof TerminalFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getClientDropdown = useGetClientsQuery({});
  useEffect(() => {
    if (getClientDropdown.isSuccess && getClientDropdown.data) {
      setClient(getClientDropdown.data.data);
    }
  }, [getClientDropdown.isSuccess, getClientDropdown.data]);

  const getBranchDropdown = useGetAllBranchQuery({ cid: formData.client });
  useEffect(() => {
    if (getBranchDropdown.isSuccess && getBranchDropdown.data) {
      setBranch(getBranchDropdown.data.data);
    }
  }, [getBranchDropdown.isSuccess, getBranchDropdown.data]);

  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        id: data.id,
        client: data.client,
        branch: data.branch,
        terminal_id: data.terminal_id,
        contract_term: data.contract_term,
        start_date: data.start_date,
        end_date: data.end_date,
        renewal: data.renewal,
        status: 1,
      });
    }
  }, [data, isOpen]);

  const [addTerminal] = useAddTerminalMutation();
  const [upTerminal] = useUpTerminalMutation();
  const submitTerminal = async () => {
    if (type === 1) {
      if (formData.terminal_id !== "" && formData.branch !== 0) {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));

          const checkstat = await addTerminal(formData1).unwrap();

          if (checkstat.success) {
            // handleClose();
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
      if (formData.terminal_id !== "" && formData.branch !== 0) {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));
          formData1.append("tid", String(formData.id));

          const checkstat = await upTerminal(formData1).unwrap();
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

  useEffect(() => {
    if (formData.start_date !== "" && formData.contract_term !== "") {
      const start = new Date(formData.start_date);
      const termMonths = Number(formData.contract_term);

      // Add months
      const end = new Date(start);
      end.setMonth(start.getMonth() + termMonths);

      // Format date as YYYY-MM-DD
      const formattedEnd = end.toISOString().split("T")[0];

      setFormData((prev) => ({
        ...prev,
        end_date: formattedEnd,
        renewal: formattedEnd,
      }));
    }
  }, [formData.start_date, formData.contract_term]);

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
                  {type === 1 ? `Add New` : `Update`} Terminal
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
                  {/* <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Branch Code</Label>
                    <Input type="text" placeholder="Branch Code" />
                  </div> */}

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Client</Label>
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
                    <Label htmlFor="date">
                      Branch <span className="text-red-500">*</span>
                    </Label>
                    <ComboBox
                      label=""
                      openKey="branch"
                      valueId={formData.branch}
                      list={branch || []}
                      onSelect={(id: string) => {
                        handleChange("branch", id);
                      }}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">
                      Terminal Id <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Terminal Id"
                      value={formData.terminal_id}
                      onChange={(e) =>
                        handleChange("terminal_id", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">
                      Contract Term{" "}
                      <span className="pl-1 text-xs">(months)</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="12"
                      value={formData.contract_term}
                      onChange={(e) =>
                        handleChange("contract_term", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Start Date</Label>
                    <Input
                      type="date"
                      placeholder="Start Date"
                      value={formData.start_date}
                      onChange={(e) =>
                        handleChange("start_date", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">End Date</Label>
                    <Input
                      type="date"
                      placeholder="End Date"
                      value={formData.end_date}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Date of Renewal</Label>
                    <Input
                      type="date"
                      placeholder="Date of Renewal"
                      value={formData.renewal}
                      onChange={(e) => handleChange("renewal", e.target.value)}
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
                    {type === 1 ? `Add` : `Update`} Terminal
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
