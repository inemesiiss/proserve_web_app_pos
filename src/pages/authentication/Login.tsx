import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import LoadingOverlay from "@/components/reusables/transition-loader";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

// import Logo from "@/assets/PROSERVELOGO.png";
// import RightDesign from "@/assets/loginRight.png";
// import LeftDesign from "@/assets/loginLeft.png";

type LoginProps = {
  onLogin?: () => void;
};

export default function LoginPage({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      onLogin?.();
      navigate("/food/main");
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const [remember, setRemember] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {loading && <LoadingOverlay />}

      {/* Decorative images */}
      {/* <div className="absolute bottom-0 left-0 hidden lg:block">
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
      </div> */}

      <section
        className="bg-cover bg-center bg-no-repeat w-full h-screen"
        style={{ backgroundImage: "url('/Login.png')" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className=" h-screen place-content-center place-items-center">
            {/* Login Card */}
            <Card className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
              <CardContent className="p-8">
                {/* Title */}
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
                  Welcome to Proserv POS System
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
                      <label className="text-gray-600">Email</label>
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
                      <label className="text-gray-600">Password</label>
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
                          {!showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        <div className="pt-2 flex justify-between">
                          <div className="flex justify-center items-center">
                            <input
                              type="checkbox"
                              id="remember"
                              checked={remember}
                              onChange={() => setRemember(!remember)}
                              className="mr-1 accent-blue-600 h-4 w-4"
                            />
                            <label
                              className="text-gray-600 text-sm select-none"
                              htmlFor="remember"
                            >
                              Keep me logged in
                            </label>
                          </div>

                          <div className="flex">
                            <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                              Forget Password
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-600 text-xs text-center font-semibold">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full mt-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>

                {/* Logo */}
                <div className="flex justify-center mt-6">
                  <img
                    src="/Login1.png"
                    alt="App Logo"
                    className="w-36 h-auto"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
