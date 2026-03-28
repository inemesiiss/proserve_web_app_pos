import Lottie from "lottie-react";
import React, { useEffect, useRef, useState } from "react";
import Success from "./../../components/reusables/Success.json";
import Loading from "./../../components/reusables/Loading.json";
import Error from "./../../components/reusables/Error.json";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useActivateAccountMutation } from "@/store/api/Admin";
import { toast } from "sonner";

function AccountActivation() {
  const navigate = useNavigate();
  const hasRun = useRef(false);
  const [view, setView] = useState(1);
  const [validate, setValidate] = useState(false);

  const { key } = useParams();

  const [actAcct] = useActivateAccountMutation();

  const submitAcct = async () => {
    try {
      const formData1 = new FormData();
      formData1.append("datas", JSON.stringify(key));
      const checkstat = await actAcct(formData1).unwrap();

      if (checkstat.success) {
        if (checkstat.error === 1) {
          toast.error(checkstat.message);
          setView(3);
        } else {
          setTimeout(() => {
            setView(2);
            toast.success("Account Activated Successfully");
          }, 4000);
        }
      } else {
        toast.error(checkstat.message);
      }
    } catch (error) {
      toast.error("Failed to activate account.");
    }
  };

  useEffect(() => {
    if (!key || hasRun.current) return;

    hasRun.current = true;
    submitAcct();
  }, [key]);

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/Login.png')" }}
    >
      {/* Dark overlay with opacity */}
      <div className="absolute " />

      {/* Content */}
      <div className="absolute left-1/2 top-1/2 z-10 w-[40vw]  -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-50/80 p-6 py-10 text-black text-center space-y-4">
        <span className="text-4xl text-center font-medium">
          Account Activation
        </span>
        {view === 1 ? (
          <Lottie animationData={Loading} loop={true} className="h-72" />
        ) : view === 2 ? (
          <Lottie animationData={Success} loop={true} className="h-64" />
        ) : (
          <Lottie animationData={Error} loop={true} className="h-64" />
        )}

        <Button
          variant={"primary"}
          disabled={view === 1}
          onClick={() => navigate("/login")}
        >
          {view === 1 ? `Please wait...` : `Proceed to Login`}
        </Button>
      </div>
    </section>
  );
}

export default AccountActivation;
