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
  const [mode, setMode] = useState<"kiosk" | "user" | "admin">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kioskId, setKioskId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (mode === "admin") {
        if (email === "demo_admin" && password === "passpass") {
          // notify parent and navigate
          onLogin?.();
          setLoading(false);
          navigate("/services");
        } else {
          alert("❌ Invalid admin credentials");
          setLoading(false);
        }
      } else if (mode === "user") {
        if (email === "demo_manager" && password === "passpass") {
          onLogin?.();
          setLoading(false);
          navigate("/property_manager/dashboard");
        } else {
          alert("❌ Invalid manager credentials");
          setLoading(false);
        }
      } else if (mode === "kiosk") {
        if (kioskId === "passpass") {
          onLogin?.();
          setLoading(false);
          navigate("/services");
        } else {
          alert("❌ Invalid kiosk ID");
          setLoading(false);
        }
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

          <h2 className="text-lg font-medium text-center text-gray-600 dark:text-gray-300 mb-6">
            Sign in as
          </h2>

          {/* Mode Switch Tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {["kiosk", "user", "admin"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m as "kiosk" | "user" | "admin")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    mode === m
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "admin" || mode === "user" ? (
                <motion.div
                  key={`${mode}-form`}
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
              ) : (
                <motion.div
                  key="kiosk-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Input
                    id="kioskId"
                    type="text"
                    placeholder="Enter your Kiosk ID"
                    value={kioskId}
                    onChange={(e) => setKioskId(e.target.value)}
                    required
                    className="rounded-lg"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Example: KS123456
                  </p>
                </motion.div>
              )}
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
