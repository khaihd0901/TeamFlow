import { useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";

import { useAuthStore } from "../stores/authStore";
const Login = () => {
  
const navigate = useNavigate();
  const { authLogin, loading } = useAuthStore();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Required"),
    }),
    onSubmit:async (values) => {
      await authLogin(values);
      navigate("/");
    },
  });

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-col items-center px-4 py-6 rounded shadow-lg bg-white w-lg">
        <h2 className="text-xl font-bold mb-6 uppercase">Login</h2>
        <form
          className="w-full max-w-sm flex flex-col"
          onSubmit={formik.handleSubmit}
        >
          <div className="flex flex-col w-full gap-2 mb-4">
            <label htmlFor="email">Email</label>
            <input
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="email"
              id="email"
              className="px-2 py-2 border border-gray-300 outline-none rounded focus:ring-1 focus:ring-gray-500"
              placeholder="Your email"
            />
          </div>

          <div className="flex flex-col w-full gap-2 mb-4">
            <label htmlFor="password">Password</label>
            <input
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              id="password"
              className="px-2 py-2 border border-gray-300 outline-none rounded focus:ring-1 focus:ring-gray-500"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-200 py-2 border border-gray-300 rounded mt-4 hover:bg-blue-400 transition-all duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;