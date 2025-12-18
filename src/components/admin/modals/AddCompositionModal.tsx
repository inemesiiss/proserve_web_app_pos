import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ComboBox } from "@/components/reusables/Barangay";
import { toast } from "sonner";
import ChooseProduct from "@/components/reusables/ChooseProduct";
import {
  useGetClientsQuery,
  useGetAllProductsQuery,
  useAddCompositionMutation,
  useGetAllProductsCompQuery,
  useUpCompositionMutation,
} from "@/store/api/Admin";
import { formatMoney } from "@/lib/utils";

type Other1 = {
  id: number;
  price: string;
};

interface Other {
  id: number;
  id1: number;
  name: string;
  product: number;
  other: Other1[];
}

interface CompositionFormData {
  id: number;
  client: number;
  main_prod: number;
  other: Other[];
}

interface Prods {
  id: number;
  image: string;
  name: string;
  prod_categ: number;
}

interface AddCompositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: CompositionFormData) => void;
  type: number;
  setType: React.Dispatch<React.SetStateAction<number>>;
  data?: any;
}

export default function AddCompositionModal({
  isOpen,
  onClose,
  // onSubmit,
  type,
  setType,
  data,
}: AddCompositionModalProps) {
  const [formData, setFormData] = useState<CompositionFormData>({
    id: 0,
    client: 0,
    main_prod: 0,
    other: [
      {
        id: 1,
        id1: 1,
        name: "",
        product: 0,
        other: [],
      },
    ],
  });

  const [client, setClient] = useState([]);
  // const [branch, setBranch] = useState([]);
  // const [categ, setCateg] = useState([]);
  const [prods, setProds] = useState<Prods[]>([]);
  const [prodsComp, setProdsComp] = useState<Prods[]>([]);

  const getClientDropdown = useGetClientsQuery({});
  useEffect(() => {
    if (getClientDropdown.isSuccess && getClientDropdown.data) {
      setClient(getClientDropdown.data.data);
    }
  }, [getClientDropdown.isSuccess, getClientDropdown.data]);

  const getAllProductsComp = useGetAllProductsCompQuery(
    { id: formData.client },
    { skip: formData.client === 0 }
  );
  useEffect(() => {
    if (getAllProductsComp.isSuccess && getAllProductsComp.data) {
      setProdsComp(getAllProductsComp.data.data);
      // console.log("Products here: ", getAllProductsComp.data.data);
    }
  }, [getAllProductsComp.isSuccess, getAllProductsComp.data]);

  const getAllProducts = useGetAllProductsQuery(
    { id: formData.client },
    { skip: formData.client === 0 }
  );
  useEffect(() => {
    if (getAllProducts.isSuccess && getAllProducts.data) {
      setProds(getAllProducts.data.data);
      console.log("Products here: ", getAllProducts.data.data);
    }
  }, [getAllProducts.isSuccess, getAllProducts.data]);

  const handleAddOther = () => {
    setFormData((prev) => {
      const maxId = prev.other.reduce(
        (max, item) => Math.max(max, item.id1),
        0
      );

      return {
        ...prev,
        other: [
          ...prev.other,
          { id: 0, id1: maxId + 1, name: "", product: 0, other: [] },
        ],
      };
    });
  };

  const handleRemoveOther = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      other: prev.other.filter((_, index) => index !== id),
    }));
  };

  const handleChange = (field: keyof CompositionFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOtherChange = (id: number, field: keyof Other, value: any) => {
    setFormData((prev) => ({
      ...prev,
      other: prev.other.map((item, index) =>
        index === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // onSubmit?.(formData);
    submitProduct();
  };

  const handleClose = () => {
    setFormData({
      id: 0,
      client: 0,
      main_prod: 0,
      other: [
        {
          id: 1,
          id1: 1,
          name: "",
          product: 0,
          other: [],
        },
      ],
    });
    setType(1);
    onClose();
  };

  useEffect(() => {
    if (data && isOpen) {
      // console.log("Data variance: ", typeof data.has_variance);
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          id: data.id,
          client: data.client,
          main_prod: data.id,
          other: data.other,
        }));
      }, 100);
    }
  }, [data, isOpen]);

  const [addComposition] = useAddCompositionMutation();
  const [upComposition] = useUpCompositionMutation();
  const submitProduct = async () => {
    if (type === 1) {
      if (
        formData.client !== 0 &&
        formData.main_prod !== 0 &&
        formData.other[0].name !== "" &&
        formData.other[0].product !== 0
      ) {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));

          const checkstat = await addComposition(formData1).unwrap();

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
      if (
        formData.client !== 0 &&
        formData.main_prod !== 0 &&
        formData.other[0].name !== "" &&
        formData.other[0].product !== 0
      ) {
        try {
          const formData1 = new FormData();
          formData1.append("datas", JSON.stringify(formData));
          const checkstat = await upComposition(formData1).unwrap();
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 backdrop-blur-sm"
        />
      )}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {type === 1 ? `Add New` : `Update`} Composition
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Client and Product */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Client</Label>
                  <ComboBox
                    label=""
                    openKey="client"
                    valueId={formData.client}
                    list={client}
                    onSelect={(id: string) => handleChange("client", id)}
                  />
                </div>
                <div>
                  <Label htmlFor="prod">Product</Label>
                  <ComboBox
                    label=""
                    openKey="prod"
                    valueId={formData.main_prod}
                    list={prodsComp}
                    onSelect={(id: string) => handleChange("main_prod", id)}
                  />
                </div>
              </div>
              <Button type="button" size={"sm"} onClick={handleAddOther}>
                Add Options
              </Button>

              {/* Other Fields */}
              <div className="flex-col max-h-[350px] overflow-y-auto">
                {formData.other.map((other, index) => (
                  <div key={index} className="flex-col border-t pt-4 w-full">
                    <div className="flex gap-2 ">
                      <div className="w-1/6">
                        <Label htmlFor="client">ID - {index}</Label>
                        <Input
                          placeholder="id1"
                          className="mt-1"
                          value={other.id1}
                          onChange={(e) =>
                            handleOtherChange(index, "id1", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-full">
                        <Label htmlFor="client">Name</Label>
                        <Input
                          placeholder="Name"
                          className="mt-1"
                          value={other.name}
                          onChange={(e) =>
                            handleOtherChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-full">
                        <Label htmlFor="product">Defaut Product</Label>
                        <ComboBox
                          label=""
                          valueId={other.product}
                          list={prods}
                          onSelect={(id: string) =>
                            handleOtherChange(index, "product", id)
                          }
                        />
                      </div>
                      <div
                        className={`${
                          index === 0 ? `hidden` : `flex`
                        } items-end pb-2 text-red-600 cursor-pointer`}
                        onClick={() => handleRemoveOther(index)}
                      >
                        <Trash2 />
                      </div>
                    </div>
                    {/* <Button
                      type="button"
                      onClick={() => handleAddOther1(other.id)}
                    >
                      Add Other1
                    </Button> */}
                    <div className="py-2">
                      <ChooseProduct
                        cid={formData.client}
                        selected={other.other}
                        onChange={(newProducts: Other1[]) => {
                          // const updated = [...formData.other];
                          // updated[index].other = newProducts;
                          // setFormData({ ...formData, other: updated });
                          const updated = [...formData.other]; // Copy the whole array
                          updated[index] = {
                            ...updated[index],
                            other: newProducts,
                          }; // Update the item immutably
                          setFormData({ ...formData, other: updated }); // Set the updated state
                        }}
                      />
                      <div className="pl-10 py-2">
                        <table className=" w-1/2">
                          {other.other.map((ot1, idx) => (
                            // <div key={idx} className="pl-10">

                            <tr key={idx} className="border-b">
                              <td>
                                {prods.find((item) => ot1.id === item.id)?.name}
                              </td>
                              <td
                                className={`text-right
                                  ${
                                    parseFloat(ot1.price) > 0
                                      ? `text-green-700`
                                      : ``
                                  }
                                `}
                              >
                                {parseFloat(ot1.price) > 0
                                  ? `+${formatMoney(parseFloat(ot1.price))}`
                                  : formatMoney(parseFloat(ot1.price))}
                              </td>
                            </tr>
                            // </div>
                          ))}
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit and Cancel */}
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
                  {type === 1 ? "Add" : "Update"} Composition
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
