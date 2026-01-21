import React, { useEffect, useState } from "react";
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
  useAddAccountMutation,
  useGetSubscriptionQuery,
  useUpAccountMutation,
} from "@/store/api/Admin";
import { toast } from "sonner";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AccountFormData) => void;
  type: number;
  setType: React.Dispatch<React.SetStateAction<number>>;
  data?: any;
}

interface AccountFormData {
  id: number;
  name: string;
  c_person: string;
  email: string;
  subscription: number;
  logo: string | File;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  renewal: string;
  term: string;
  color: string;
  no_license: string;
  status: number;
}

export type IdName = {
  id: number;
  name: string;
};

export default function AddAccountModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  setType,
  data,
}: AddAccountModalProps) {
  const initial = {
    id: 0,
    name: "",
    c_person: "",
    email: "",
    subscription: 1,
    logo: "",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    renewal: "",
    term: "",
    color: "",
    no_license: "0",
    status: 0,
  };
  const [formData, setFormData] = useState<AccountFormData>(initial);
  const [subscription, setSubscription] = useState<IdName[]>([]);

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

  const handlelogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];

    if (!file) return;

    // Validate size
    if (file.size > 1 * 1024 * 1024) {
      toast.error("File must be 1MB or less.");
      input.value = ""; // reset so selecting same file triggers change
      return;
    }

    setFormData({ ...formData, logo: file });

    // Reset after successful upload too (optional)
    // input.value = "";
  };

  const handleChange = (field: keyof AccountFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "subscription" || field === "no_license"
          ? Number(value)
          : value,
    }));
  };

  const getSubscription = useGetSubscriptionQuery({});

  useEffect(() => {
    if (getSubscription.isSuccess && getSubscription.data) {
      setSubscription(getSubscription.data.data);
    }
  }, [getSubscription.isSuccess, getSubscription.data]);

  // Load the account data only once when modal opens or when "data" changes
  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        id: data.id,
        name: data.name,
        c_person: data.c_person,
        email: data.email,
        subscription: Number(data.subscription),
        logo: "",
        start_date: data.start_date,
        end_date: data.end_date,
        start_time: data.start_time,
        end_time: data.end_time,
        renewal: data.renewal,
        term: data.term,
        color: data.color,
        no_license: data.no_license,
        status: data.status,
      });
    }
  }, [data, isOpen]);

  const [addAccount] = useAddAccountMutation();
  const [upAccount] = useUpAccountMutation();
  const submitAccount = async () => {
    if (type === 1) {
      if (formData.name !== "") {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));
          if (formData.logo) {
            formData1.append("logo", formData.logo);
          }

          const checkstat = await addAccount(formData1).unwrap();

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
          formData1.append("cid", String(formData.id));
          formData1.append("sub", String(data.subscription));
          if (formData.logo) {
            formData1.append("logo", formData.logo);
          }

          const checkstat = await upAccount(formData1).unwrap();

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
    if (formData.start_date !== "" && formData.term !== "") {
      const start = new Date(formData.start_date);
      const termMonths = Number(formData.term);

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
  }, [formData.start_date, formData.term]);

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
                  {type === 2 ? `Update` : `Add New`} Account
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
                    <Label htmlFor="date">Account Name</Label>
                    <Input
                      type="text"
                      placeholder="Account Name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Contact Person</Label>
                    <Input
                      type="text"
                      placeholder="Contact Person"
                      value={formData.c_person}
                      onChange={(e) => handleChange("c_person", e.target.value)}
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
                    <Label htmlFor="date">Plan Subscription</Label>
                    <Select
                      value={
                        type === 1
                          ? String(formData.subscription)
                          : formData.subscription !== 0
                            ? String(formData.subscription)
                            : String(data.subscription)
                      }
                      onValueChange={(value) =>
                        handleChange("subscription", value)
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {subscription.map((item: IdName, index) => (
                          <SelectItem key={index} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">No. of Licenses</Label>
                    <Input
                      type="text"
                      value={String(formData.no_license)}
                      onChange={(e) =>
                        handleChange("no_license", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">
                      Contract Term
                      <span className="pl-1 text-xs">(months)</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="12"
                      value={formData.term}
                      onChange={(e) => handleChange("term", e.target.value)}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Start Date</Label>
                    <Input
                      type="date"
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
                      value={formData.end_date}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                      readOnly
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Start Time</Label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) =>
                        handleChange("start_time", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">End Time</Label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => handleChange("end_time", e.target.value)}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Date of Renewal</Label>
                    <Input
                      type="date"
                      value={formData.renewal}
                      onChange={(e) => handleChange("renewal", e.target.value)}
                      readOnly
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">Theme</Label>
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">
                      Company Logo{" "}
                      <span className="text-xs text-blue-600">
                        (must be less than 1 mb)
                      </span>
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlelogoChange}
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
                    {type === 2 ? `Update Account` : `Add Account`}
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
