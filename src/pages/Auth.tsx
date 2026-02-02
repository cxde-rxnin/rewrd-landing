import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/api/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, loading, error, user, accessToken, initialized, getUser } = useAuth();
  console.log('AuthPage user:', user);
  console.log('AuthPage initialized:', initialized);
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    account_type: "", // <-- force selection
  });
  

  useEffect(() => {
    console.log('useEffect - user:', user, 'initialized:', initialized, 'accessToken:', accessToken);
    if (!initialized) return;
    if (accessToken && !user) {
      // populate user if token exists, then navigate
      getUser?.().finally(() => navigate("/dashboard"));
      return;
    }
    if (user) {
      console.log('Fetched user object:', user); // Debug: log fetched user
      navigate("/dashboard");
    }
  }, [initialized, user, accessToken, getUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Login form data:', form); // Debug: log form data
      await login(form.email, form.password);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.message || "Login failed");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Signup form data:', form); // Debug: log form data
      await register(form);
      toast.success("Account created! You can now log in.");
      setTab("login");
    } catch (err: any) {
      toast.error(err?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full h-screen flex overflow-hidden">
        {/* Left: Image and text */}
        <div className="hidden md:flex flex-col justify-between w-1/2 relative">
          <div className="absolute inset-0 w-full h-full">
            <img src="/login.jpg" alt="Login visual" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 mb-8 ml-8 text-left mt-auto">
            <h1 className="text-8xl font-bold text-white drop-shadow-lg">PartnerPulse</h1>
          </div>
        </div>

        {/* Right: Auth form */}
        <div className="w-full md:w-1/2 flex flex-col h-screen justify-center items-center bg-white">
          <div className="w-full max-w-md p-8 rounded-xl">
            <div className="text-3xl font-bold text-gray-900 mb-2">{tab === "signup" ? "Create an account" : "Log in"}</div>
            <div className="text-sm text-gray-500 mb-6">
              {tab === "signup" ? (
                <>
                  Already have an account?{' '}
                  <span className="text-purple-600 cursor-pointer font-semibold" onClick={() => setTab("login")}>Log in</span>
                </>
              ) : (
                <>
                  Don&apos;t have an account?{' '}
                  <span className="text-purple-600 cursor-pointer font-semibold" onClick={() => setTab("signup")}>Sign up</span>
                </>
              )}
            </div>
            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="py-3 px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="py-3 px-4 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="py-3 px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="py-3 px-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="py-3 px-4 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Account Type</label>
                  <select
                    name="account_type"
                    value={form.account_type}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="" disabled>Select account type</option>
                    <option value="participant">Participant</option>
                    <option value="influencer">Influencer</option>
                    <option value="brand">Brand</option>
                  </select>
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            )}
          </div>
        </div>      
       </div> 
    </div>
  );
};

export default AuthPage;
