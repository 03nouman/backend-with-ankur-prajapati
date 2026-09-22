import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../../../context/useUser";

const Register = () => {
  const navigate = useNavigate();
  const { setUser, setAccessToken } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(
          result.errors?.[0]?.message ||
            result.message ||
            "Registration failed",
        );
        return;
      }

      setUser(result.data.user);
      setAccessToken(result.accessToken);
      navigate("/profile");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <form
        className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">Register to continue.</p>
        </div>

        {error && (
          <p
            className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}

        <label className="block text-sm font-medium text-slate-700">
          Name
          <input
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            name="name"
            onChange={handleChange}
            required
            type="text"
            value={formData.name}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={formData.email}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
            minLength="6"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={formData.password}
          />
        </label>

        <button
          className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </main>
  );
};

export default Register;
