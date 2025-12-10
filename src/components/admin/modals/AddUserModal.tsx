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
  useAddUserMutation,
  useGetAllBranchQuery,
  useGetClientsQuery,
  useGetProfileQuery,
  useUpUserMutation,
} from "@/store/api/Admin";
import type { IdName } from "./AddAccountModal";
import { ComboBox } from "@/components/reusables/Barangay";
import { toast } from "sonner";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: UserFormData) => void;
  type: number;
  setType: React.Dispatch<React.SetStateAction<number>>;
  data?: any;
}

interface UserFormData {
  id: number;
  client: number;
  branch: number;
  user_id: string;
  password: string;
  fullname: string;
  contact_no: string;
  profile: number;
  email: string;
  status: number;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  setType,
  data,
}: AddUserModalProps) {
  console.log("Data here: ", data);
  const initial = {
    id: 0,
    client: 0,
    branch: 0,
    user_id: "",
    password: "",
    fullname: "",
    contact_no: "",
    profile: 0,
    email: "",
    status: 1,
  };
  const [formData, setFormData] = useState<UserFormData>(initial);
  const [client, setClient] = useState<IdName[]>([]);
  const [branch, setBranch] = useState<IdName[]>([]);
  const [profile, setProfile] = useState<IdName[]>([]);

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

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getProfiles = useGetProfileQuery({});
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
    if (getProfiles.isSuccess && getProfiles.data) {
      setProfile(getProfiles.data.data);
    }
  }, [getProfiles.isSuccess, getProfiles.data]);

  useEffect(() => {
    if (data && isOpen) {
      setFormData({
        id: data.id,
        client: data.client,
        branch: data.branch,
        user_id: data.user_id,
        password: "",
        fullname: data.fullname,
        contact_no: data.contact_no,
        profile: Number(data.profile),
        email: data.email,
        status: 1,
      });
    } else if (isOpen) {
      setFormData(initial);
    }
  }, [data, isOpen]);

  const [addUser] = useAddUserMutation();
  const [upUser] = useUpUserMutation();
  const submitTerminal = async () => {
    if (type === 1) {
      if (
        formData.user_id !== "" &&
        formData.password !== "" &&
        formData.branch !== 0
      ) {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));

          const checkstat = await addUser(formData1).unwrap();

          if (checkstat.success) {
            if (checkstat.error === 1) {
              toast.error(checkstat.message);
            } else {
              handleClose();
              toast.success("Successfully Added.");
            }
          } else {
            toast.error(checkstat.message);
          }

          console.log(checkstat);
        } catch (error) {}
      } else {
        toast.error("Please complete required fields.");
      }
    } else {
      if (formData.user_id !== "" && formData.branch !== 0) {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));
          formData1.append("tid", String(formData.id));

          const checkstat = await upUser(formData1).unwrap();
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
                  {type === 1 ? `Add New` : `Update`} User
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4"
                autoComplete="off"
              >
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
                    <Label htmlFor="date">User Fullname</Label>
                    <Input
                      type="text"
                      placeholder="User Fullname"
                      value={formData.fullname}
                      onChange={(e) => handleChange("fullname", e.target.value)}
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
                    <Label htmlFor="date">Username</Label>
                    <Input
                      type="text"
                      placeholder="User ID"
                      value={formData.user_id}
                      onChange={(e) => handleChange("user_id", e.target.value)}
                      autoComplete="new-user"
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">
                      Password
                      <span className="pl-1 text-blue-500 text-[9px]">
                        (leave blank if not going to change)
                      </span>
                    </Label>
                    <Input
                      type="password"
                      placeholder="User Password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="grid max-w-md items-center gap-1 ">
                    <Label htmlFor="date">User Profile</Label>
                    <Select
                      value={
                        type === 1
                          ? String(formData.profile)
                          : formData.profile !== 0
                          ? String(formData.profile)
                          : String(data.profile)
                      }
                      onValueChange={(value) => handleChange("profile", value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {profile.map((item1: IdName) => (
                          <SelectItem key={item1.id} value={String(item1.id)}>
                            {item1.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    {type === 1 ? `Add` : `Update`} User
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
