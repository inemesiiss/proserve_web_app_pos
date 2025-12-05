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

type products = {
  id: number;
  name: string;
  prod_categ: number;
  image: string;
};

interface ChooseProductPropse {
  cid: number;
}
function ChooseProduct({ cid }: ChooseProductPropse) {
  const apiDomain = import.meta.env.VITE_API_DOMAIN;
  const [open, setOpen] = useState(false);
  const [categ, setCateg] = useState<IdName[]>([]);
  const [prods, setProds] = useState<products[]>([]);

  const [seleCateg, setSeleCateg] = useState(0);
  const getCategories = useGetAllCategoriesQuery(
    { id: cid },
    { skip: cid === 0 }
  );
  useEffect(() => {
    if (getCategories.isSuccess && getCategories.data) {
      setCateg(getCategories.data.data);
    }
  }, [getCategories.isSuccess, getCategories.data]);

  const getAllProducts = useGetAllProductsQuery(
    { id: cid },
    { skip: cid === 0 }
  );
  useEffect(() => {
    if (getAllProducts.isSuccess && getAllProducts.data) {
      setProds(getAllProducts.data.data);
    }
  }, [getAllProducts.isSuccess, getAllProducts.data]);

  return (
    <>
      <span
        className="bg-blue-500 text-white hover:bg-blue-600 px-2 rounded-md"
        onClick={() => setOpen(true)}
      >
        Choose
      </span>

      {open && (
        <CustomDialog
          close={setOpen}
          title={``}
          width={`!w-[50vw]`}
          height={`h-[60vh]`}
          closeIcon={`Y`}
          button=""
        >
          <div className="grid grid-cols-1 py-2 gap-4">
            <div className="grid max-w-sm items-center gap-1 ">
              <Label htmlFor="date">Product Category</Label>
              <ComboBox
                label=""
                openKey="category"
                valueId={seleCateg}
                list={categ || []}
                onSelect={(id: number) => {
                  setSeleCateg(id);
                }}
              />
            </div>

            <div className="flex gap-4">
              {prods.map((item) => (
                <>
                  <div>
                    <img src={apiDomain + item.image} className="w-24 h-24" />
                    <span>{item.name}</span>
                  </div>
                </>
              ))}
            </div>
            <Button
              className="w-full"
              //   variant="primary"
              onClick={() => setOpen(false)}
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
