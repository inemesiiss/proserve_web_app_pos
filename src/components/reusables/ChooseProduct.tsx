import { useEffect, useState } from "react";
import CustomDialog from "./CustomDialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ComboBox } from "./Barangay";
import type { IdName } from "../admin/modals/AddAccountModal";
import {
  useGetAllCategoriesQuery,
  useGetAllProductsQuery,
} from "@/store/api/Admin";

type Product = {
  id: number;
  name: string;
  prod_categ: number;
  image: string;
};

interface ChooseProductProps {
  cid: number;
  selected: { id: number; price: string }[]; // <-- from parent
  onChange: (products: { id: number; price: string }[]) => void; // <-- send back
}

function ChooseProduct({ cid, selected, onChange }: ChooseProductProps) {
  const apiDomain = import.meta.env.VITE_API_DOMAIN;
  const [open, setOpen] = useState(false);

  const [categ, setCateg] = useState<IdName[]>([]);
  const [allProds, setAllProds] = useState<Product[]>([]);
  const [prods, setProds] = useState<Product[]>([]);
  const [seleCateg, setSeleCateg] = useState(0);

  // Local state is only for temporary UI before save
  const [selectedProducts, setSelectedProducts] =
    useState<{ id: number; price: string }[]>(selected);

  // Sync when modal opens
  useEffect(() => {
    setSelectedProducts(selected);
  }, [open]);

  // Fetch categories
  const getCategories = useGetAllCategoriesQuery(
    { id: cid },
    { skip: cid === 0 }
  );

  useEffect(() => {
    if (getCategories.isSuccess && getCategories.data) {
      setCateg([{ id: 0, name: "All Categories" }, ...getCategories.data.data]);
    }
  }, [getCategories.isSuccess, getCategories.data]);

  // Fetch all products
  const getAllProducts = useGetAllProductsQuery(
    { id: cid },
    { skip: cid === 0 }
  );

  useEffect(() => {
    if (getAllProducts.isSuccess && getAllProducts.data) {
      setAllProds(getAllProducts.data.data);
      setProds(getAllProducts.data.data);
    }
  }, [getAllProducts.isSuccess, getAllProducts.data]);

  // Filter products by category
  useEffect(() => {
    if (seleCateg === 0) {
      setProds(allProds);
    } else {
      setProds(allProds.filter((p) => p.prod_categ === seleCateg));
    }
  }, [seleCateg, allProds]);

  // Toggle product
  const toggleProduct = (id: number) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === id);

      if (exists) return prev.filter((p) => p.id !== id);

      return [...prev, { id, price: "0" }];
    });
  };

  // Update added price input
  const updatePrice = (id: number, price: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price } : p))
    );
  };

  const isSelected = (id: number) => selectedProducts.some((p) => p.id === id);

  return (
    <>
      <span
        className="bg-blue-500 text-white hover:bg-blue-600 px-2 py-[2px] rounded-md cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Add Other Options
      </span>

      {open && (
        <CustomDialog
          close={setOpen}
          title={`Choose Products`}
          width={`!w-[50vw]`}
          height={`h-[80vh]`}
          closeIcon="N"
          button=""
        >
          <div className="grid grid-cols-1 py-2 gap-4">
            {/* Category Filter */}
            <div className="grid max-w-sm items-center gap-1">
              <Label>Product Category</Label>
              <ComboBox
                label=""
                openKey="category"
                valueId={seleCateg}
                list={categ}
                onSelect={(id: number) => setSeleCateg(id)}
              />
            </div>

            {/* Product List */}
            <div className="grid grid-cols-4 gap-4">
              {prods.map((item) => {
                const selectedInfo = selectedProducts.find(
                  (p) => p.id === item.id
                );

                return (
                  <div
                    key={item.id}
                    className="border p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleProduct(item.id)}
                  >
                    <img
                      src={apiDomain + item.image}
                      className={`w-24 h-24 mx-auto mb-2 rounded-md ${
                        isSelected(item.id) ? "ring-4 ring-blue-400" : ""
                      }`}
                    />

                    <div className="flex justify-between items-center">
                      <span>{item.name}</span>

                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isSelected(item.id)}
                        onChange={() => toggleProduct(item.id)}
                      />
                    </div>

                    {/* Price Addition Input */}
                    {isSelected(item.id) && (
                      <input
                        type="text"
                        className="mt-2 w-full border rounded px-2 py-1"
                        value={selectedInfo?.price ?? ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updatePrice(item.id, e.target.value)}
                        placeholder="Add-on price"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit */}
            <Button
              className="w-full"
              onClick={() => {
                onChange(selectedProducts); // <-- send back to parent
                setOpen(false);
              }}
            >
              Select
            </Button>
          </div>
        </CustomDialog>
      )}
    </>
  );
}

export default ChooseProduct;
