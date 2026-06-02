"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { AuthCard, FieldError } from "../../../components/AuthCard";

const schema = Yup.object({
  email: Yup.string().email("Enter a valid registered email").required("Email is required"),
  surname: Yup.string().min(2, "Surname is required").required("Surname is required"),
  otp: Yup.string().matches(/^\d{6}$/, "OTP must be 6 digits")
});

export default function TeacherLoginPage() {
  return (
    <AuthCard title="Teacher OTP login" subtitle="Teachers sign in with their registered email and surname, then verify the OTP sent to that email.">
      <Formik initialValues={{ email: "", surname: "", otp: "" }} validationSchema={schema} onSubmit={(_, helpers) => { helpers.setStatus("OTP flow ready. Connect request/verify calls to the server auth routes."); helpers.setSubmitting(false); }}>
        {({ errors, touched, getFieldProps, status }) => (
          <Form className="grid gap-4">
            <label>Registered email<input type="email" {...getFieldProps("email")} /></label>
            <FieldError>{touched.email && errors.email}</FieldError>
            <label>Surname<input {...getFieldProps("surname")} /></label>
            <FieldError>{touched.surname && errors.surname}</FieldError>
            <label>One-time password<input inputMode="numeric" placeholder="6-digit OTP" {...getFieldProps("otp")} /></label>
            <FieldError>{touched.otp && errors.otp}</FieldError>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="secondary" type="button">Request OTP</button>
              <button className="primary" type="submit">Verify and enter</button>
            </div>
            {status && <p className="rounded-lg bg-[#e9f4ee] p-3 text-sm font-bold text-emerald-dark">{status}</p>}
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
