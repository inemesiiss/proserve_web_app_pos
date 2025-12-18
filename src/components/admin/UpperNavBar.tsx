import { motion } from "framer-motion";
import { User } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import BackButton from "../food/components/cashier/BackButton";
// import {
//   Link,
//   //  useNavigate
// } from "react-router-dom";
// import { QuickThemeToggle } from "@/components/reusables/QuickThemeToggle";
// import Logo from "@/assets/PROSERVELOGO.png";
// import { logout as logoutAction } from "@/store/auth/authSlice";
// import { useLogoutMutation } from "@/store/api/authApi";

// import BackButton from "../food/components/cashier/BackButton";

interface UpperNavBarProps {
  setLoggedIn?: (v: boolean) => void;
  isBlank?: boolean; // 👈 determines if the bar should be black and empty
}

export default function UpperNavBar({
  setLoggedIn,
  isBlank = false,
}: UpperNavBarProps) {
  console.log(setLoggedIn);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  // const [logout] = useLogoutMutation();

  // const handleLogout = async () => {
  //   // if (setLoggedIn) {
  //   //   setLoggedIn(true);
  //   // }
  //   try {
  //     await logout().unwrap();
  //     localStorage.clear();
  //     dispatch(logoutAction());
  //     navigate("/login");
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Logout failed", error);
  //   }
  //   // }
  //   // dispatch(logout());

  //   // navigate("/login");
  //   // localStorage.clear();
  //   // navigate("/food/main");
  // };

  if (isBlank) {
    return (
      <header className="shrink-0 bg-white dark:bg-gray-800 h-[64px] shadow-md border-b border-gray-200 dark:border-gray-700" />
    );
  }

  return (
    <header className="shrink-0 bg-white dark:bg-gray-800 shadow-md py-3 px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="flex justify-center ">
        {/* <img src={Logo} alt="App Logo" className="w-36 h-auto" /> */}
      </div>

      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* <QuickThemeToggle /> */}

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer">
          <User className="text-gray-700 dark:text-gray-200 w-5 h-5" />
          <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">
            User
          </span>
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-blue-700">{""}</h2>
          {<BackButton to={"/food/main"} label="Home" />}
        </div>

        {/* <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button> */}
        {/* <Link to="/food/main">
          <span className="flex items-center gap-2 bg-gray-500 text-white px-3 py-1.5 rounded-full hover:bg-gray-600 transition shadow-sm cursor-pointer">
            <SquareArrowLeft />
            <span className="text-sm font-medium">Back</span>
          </span>
        </Link> */}
        {/* <div className="">
          <BackButton to="/food/main" label="Back" />
        </div> */}
      </motion.div>
    </header>
  );
}
