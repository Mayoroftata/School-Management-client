"use client";

import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AuthCard, FieldError } from "../../../components/AuthCard";
import { apiRequest, saveSession } from "../../../lib/api";

const schema = Yup.object({
  email: Yup.string().email("Enter a valid admin email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <AuthCard title="Admin login" subtitle="Principal and school administrators can access staffing, admissions, documentation and oversight tools after authentication.">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={schema}
        onSubmit={async (values, helpers) => {
          try {
            const data = await apiRequest("/api/auth/login", {
              method: "POST",
              body: JSON.stringify(values)
            });
            saveSession(data);
            toast.success("Admin login successful");
            router.push("/admin/dashboard");
          } catch (error) {
            toast.error(error.message);
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, getFieldProps, isSubmitting }) => (
          <Form className="grid gap-4">
            <label>Admin email<input type="email" {...getFieldProps("email")} /></label>
            <FieldError>{touched.email && errors.email}</FieldError>
            <label>Password<input type="password" {...getFieldProps("password")} /></label>
            <FieldError>{touched.password && errors.password}</FieldError>
            <button className="primary w-full disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Logging in..." : "Log in"}</button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
