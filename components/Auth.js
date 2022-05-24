import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({
        email,
        password,
      });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-black text-gray-300">
        <div className="m-auto">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border bg-black px-4 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="mail"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-6 border bg-black px-4 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="password"
            />
          </div>
          <div className="mt-6 flex justify-between">
            <button
              className="bg-blue-600 py-2 pl-4 pr-12 outline-none hover:bg-blue-800 focus:bg-blue-800"
              onClick={(e) => {
                e.preventDefault();
                handleLogin(email, password);
              }}
              disabled={loading}
            >
              <span>{loading ? "Loading" : "Login"}</span>
            </button>

            <button
            disabled
              className="p-2 text-sm outline-none focus:ring-2"
              onClick={(e) => {
                e.preventDefault();
                handleSignup(email, password);
              }}
            >
              <span>{loading ? "Loading" : "SignUp"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
