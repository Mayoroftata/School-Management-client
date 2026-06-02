"use client";

import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AuthCard, FieldError } from "../../../components/AuthCard";
import { apiRequest, saveSession } from "../../../lib/api";

const schema = Yup.object({
  admissionNo: Yup.string().required("Admission number is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required")
});

export default function StudentLoginPage() {
  const router = useRouter();

  return (
    <AuthCard
      title="Student login"
      subtitle="Access results, report cards, school fee history and anonymous complaint reporting."
      footer={<span>New student? <Link className="font-bold text-emerald-dark" href="/student/register">Register here</Link>.</span>}
    >
      <Formik
        initialValues={{ admissionNo: "", password: "" }}
        validationSchema={schema}
        onSubmit={async (values, helpers) => {
          try {
            const data = await apiRequest("/api/auth/student/login", {
              method: "POST",
              body: JSON.stringify(values)
            });
            saveSession(data);
            toast.success("Student login successful");
            router.push("/student/dashboard");
          } catch (error) {
            toast.error(error.message);
          } finally {
            helpers.setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, getFieldProps, isSubmitting }) => (
          <Form className="grid gap-4">
            <label>Admission number<input placeholder="GF/JS1/024" {...getFieldProps("admissionNo")} /></label>
            <FieldError>{touched.admissionNo && errors.admissionNo}</FieldError>
            <label>Password<input type="password" {...getFieldProps("password")} /></label>
            <FieldError>{touched.password && errors.password}</FieldError>
            <button className="primary w-full disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Logging in..." : "Log in"}</button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
