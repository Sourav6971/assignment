import axios from "axios";
import { useState } from "react";
import { database_url } from "../config";
import { useAuthStore } from "../store/store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"user" | "admin">("user");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    if (isLogin) setRole("user"); // force user for signup
    setFormData({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(`${database_url}/signin`, {
          username: formData.username,
          password: formData.password,
          role,
        });

        const {
          token,
          firstName,
          lastName,
          username,
          role: userRole,
        } = res.data;

        if (!token) {
          alert("Invalid username or password");
          return;
        }

        setAuth(
          token,
          userRole,
          userRole === "admin" ? null : firstName,
          userRole === "admin" ? null : lastName,
          username
        );

        navigate("/profile");
      } else {
        const res = await axios.post(`${database_url}/signup`, formData);

        const {
          token,
          firstName,
          lastName,
          username,
          role: userRole,
        } = res.data;

        if (!token) {
          alert("User already exists");
          return;
        }

        setAuth(token, userRole, firstName, lastName, username);
        navigate("/profile");
      }
    } catch (error: any) {
      console.error("Error:", error.response?.data || error.message);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <form
        onSubmit={handleSubmit}
        className="border border-gray-300 flex flex-col gap-4 hover:bg-gray-50 transition rounded-lg px-6 py-8 shadow-md min-w-96"
      >
        {isLogin && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
            className="shadow p-3 outline-none rounded-md"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}

        {!isLogin && (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              className="shadow p-3 outline-none rounded-md"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              className="shadow p-3 outline-none rounded-md"
              required
            />
          </>
        )}

        <input
          type="email"
          name="username"
          placeholder="Email"
          value={formData.username}
          onChange={handleChange}
          className="shadow p-3 outline-none rounded-md"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="shadow p-3 outline-none rounded-md"
          required
        />

        <button
          type="submit"
          className="p-2 shadow cursor-pointer text-white bg-black rounded-md"
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        <p
          onClick={handleToggle}
          className="cursor-pointer hover:underline text-center text-sm mt-2"
        >
          {isLogin
            ? "Don't have an account? Signup here."
            : "Already have an account? Login here."}
        </p>
      </form>
    </div>
  );
};

export default Login;
