import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import LoadingOverlay from "@/components/reusables/transition-loader";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

import Logo from "@/assets/PROSERVELOGO.png";
import RightDesign from "@/assets/loginRight.png";
import LeftDesign from "@/assets/loginLeft.png";

type LoginProps = {
  onLogin?: () => void;
};

export default function LoginPage({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === "user" && password === "passpass") {
        onLogin?.();
        setLoading(false);
        navigate("/food/main");
      } else {
        alert("❌ Invalid manager credentials");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {loading && <LoadingOverlay />}

      {/* Decorative images */}
      <div className="absolute bottom-0 left-0 hidden lg:block">
        <img
          src={LeftDesign}
          alt="Left Design"
          className="h-auto w-[320px] object-contain"
        />
      </div>
      <div className="absolute top-0 right-0 hidden lg:block">
        <img
          src={RightDesign}
          alt="Right Design"
          className="h-auto w-[320px] object-contain"
        />
      </div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-8">
          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
            Welcome to <span className="text-blue-500">Pro</span>
            <span className="text-green-500">Pos</span> System
          </h1>

          <h2 className="text-lg font-medium text-center text-gray-600 dark:text-gray-300 mb-6 ">
            Sign in to your account
          </h2>

          {/* Dynamic Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`login-form`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Input
                  id="email"
                  type="text"
                  placeholder="example.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-lg"
                />

                {/* Password with toggle */}
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
            >
              Sign in
            </Button>
          </form>

          {/* Logo */}
          <div className="flex justify-center mt-6">
            <img src={Logo} alt="App Logo" className="w-36 h-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
