"use client";

import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AuthCard, FieldError } from "../../../components/AuthCard";
import { apiRequest } from "../../../lib/api";

const schema = Yup.object({
  firstName: Yup.string().min(2, "First name is required").required("First name is required"),
  middleName: Yup.string(),
  lastName: Yup.string().min(2, "Last name is required").required("Last name is required"),
  guardianName: Yup.string().min(2, "Enter parent or guardian name").required("Guardian name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  intendedClass: Yup.string().required("Select intended class"),
  track: Yup.string().required("Select track"),
  phone: Yup.string().min(8, "Enter a reachable phone number").required("Phone number is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string().oneOf([Yup.ref("password")], "Passwords must match").required("Confirm password")
});

export default function StudentRegisterPage() {
  const router = useRouter();
  const [availableClasses, setAvailableClasses] = useState(["JS1", "JS2", "JS3"]);
  const [selectedTrack, setSelectedTrack] = useState("Junior");
  const [registrationData, setRegistrationData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update available classes when track changes
  const handleTrackChange = (track, setFieldValue) => {
    setSelectedTrack(track);
    
    let classes = [];
    if (track === "Junior") {
      classes = ["JS1", "JS2", "JS3"];
      setFieldValue("intendedClass", "JS1");
    } else if (track === "Science") {
      classes = ["SS1", "SS2", "SS3"];
      setFieldValue("intendedClass", "SS1");
    } else if (track === "Commercial") {
      classes = ["SS1", "SS2", "SS3"];
      setFieldValue("intendedClass", "SS1");
    } else if (track === "Art") {
      classes = ["SS1", "SS2", "SS3"];
      setFieldValue("intendedClass", "SS1");
    }
    
    setAvailableClasses(classes);
  };

  // Get class helper text based on track
  const getClassHelperText = () => {
    if (selectedTrack === "Junior") {
      return "Junior Secondary School (Basic 7-9)";
    } else if (selectedTrack === "Science") {
      return "Senior Secondary Science Track - Focus on Physics, Chemistry, Biology";
    } else if (selectedTrack === "Commercial") {
      return "Senior Secondary Commercial Track - Focus on Accounting, Economics, Commerce";
    } else if (selectedTrack === "Art") {
      return "Senior Secondary Art Track - Focus on Literature, Government, CRS/IRS";
    }
    return "";
  };

  // Handle copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Admission number copied to clipboard!");
  };

  // Reset form and register again
  const handleRegisterAnother = () => {
    setShowSuccess(false);
    setRegistrationData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (showSuccess && registrationData) {
    return (
      <AuthCard
        title="✅ Registration Successful!"
        subtitle="Your child/ward has been successfully registered"
        footer={null}
      >
        <div className="space-y-6">
          {/* Success Animation */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Registration Complete!</h3>
            <p className="text-gray-600 mt-2">
              Your application has been submitted successfully
            </p>
          </div>

          {/* Admission Number Card */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Admission Number</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-2xl font-bold text-blue-800 font-mono">
                {registrationData.admission_no}
              </p>
              <button
                onClick={() => copyToClipboard(registrationData.admission_no)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
              >
                Copy
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-gray-600">
                <strong>Student:</strong> {registrationData.name}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Guardian:</strong> {registrationData.guardian_name}
              </p>
            </div>
          </div>

          {/* Important Instructions */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">📌 Important Instructions</h4>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>Save this admission number for future reference</li>
              <li>Use your email and password to login to the student portal</li>
              <li>Complete your documentation before the deadline</li>
              <li>Contact the school office for any assistance</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3">
            <button
              onClick={() => router.push("/student/login")}
              className="primary w-full bg-blue-600 hover:bg-blue-700"
            >
              Go to Login Page
            </button>
            <button
              onClick={handleRegisterAnother}
              className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Register Another Student
            </button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Student Admission Registration"
      subtitle="Open an admission file for your child or ward"
      footer={<span>Already registered? <Link className="font-bold text-emerald-dark" href="/student/login">Log in here</Link>.</span>}
    >
      <Formik
        initialValues={{ 
          firstName: "", 
          middleName: "",
          lastName: "", 
          guardianName: "", 
          email: "", 
          phone: "", 
          intendedClass: "JS1", 
          track: "Junior", 
          password: "", 
          confirmPassword: "" 
        }}
        onSubmit={async (values, helpers) => {
          try {
            const { confirmPassword, ...submitData } = values;
            const data = await apiRequest("/api/admissions/student", {
              method: "POST",
              body: JSON.stringify(submitData)
            });
            
            // Store registration data
            setRegistrationData(data.student);
            setShowSuccess(true);
            
            // Show a brief success notification
            toast.success("Registration successful! Check your admission number below.");
            
          } catch (error) {
            toast.error(error.message);
            helpers.setSubmitting(false);
          }
        }}
        validationSchema={schema}
      >
        {({ errors, touched, getFieldProps, setFieldValue, isSubmitting, status }) => (
          <Form className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label>First name *</label>
                <input {...getFieldProps("firstName")} />
                <FieldError>{touched.firstName && errors.firstName}</FieldError>
              </div>
              <div>
                <label>Middle name</label>
                <input {...getFieldProps("middleName")} />
                <FieldError>{touched.middleName && errors.middleName}</FieldError>
              </div>
            </div>
            
            <div>
              <label>Last name *</label>
              <input {...getFieldProps("lastName")} />
              <FieldError>{touched.lastName && errors.lastName}</FieldError>
            </div>
            
            <div>
              <label>Parent/Guardian name *</label>
              <input {...getFieldProps("guardianName")} />
              <FieldError>{touched.guardianName && errors.guardianName}</FieldError>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label>Email *</label>
                <input type="email" {...getFieldProps("email")} />
                <FieldError>{touched.email && errors.email}</FieldError>
              </div>
              <div>
                <label>Phone *</label>
                <input {...getFieldProps("phone")} />
                <FieldError>{touched.phone && errors.phone}</FieldError>
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label>Track / Department *</label>
                <select 
                  {...getFieldProps("track")}
                  onChange={(e) => {
                    getFieldProps("track").onChange(e);
                    handleTrackChange(e.target.value, setFieldValue);
                  }}
                >
                  <option value="Junior">Junior Secondary (JS1 - JS3)</option>
                  <option value="Science">Senior Secondary - Science</option>
                  <option value="Commercial">Senior Secondary - Commercial</option>
                  <option value="Art">Senior Secondary - Art</option>
                </select>
                <FieldError>{touched.track && errors.track}</FieldError>
              </div>
              <div>
                <label>Class *</label>
                <select {...getFieldProps("intendedClass")}>
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
                <FieldError>{touched.intendedClass && errors.intendedClass}</FieldError>
              </div>
            </div>
            
            {/* Helper Text */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>📚 {selectedTrack === "Junior" ? "Junior Secondary" : "Senior Secondary"} Education:</strong> {getClassHelperText()}
              </p>
              {selectedTrack !== "Junior" && (
                <p className="text-xs text-blue-600 mt-1">
                  Core subjects: Mathematics, English Language + specialized subjects for {selectedTrack} track
                </p>
              )}
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label>Password *</label>
                <input type="password" {...getFieldProps("password")} />
                <FieldError>{touched.password && errors.password}</FieldError>
              </div>
              <div>
                <label>Confirm password *</label>
                <input type="password" {...getFieldProps("confirmPassword")} />
                <FieldError>{touched.confirmPassword && errors.confirmPassword}</FieldError>
              </div>
            </div>
            
            <button className="primary w-full disabled:opacity-60" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
            
            {status && (
              <p className="rounded-lg bg-[#e9f4ee] p-3 text-sm font-bold text-emerald-dark">
                {status}
              </p>
            )}
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}