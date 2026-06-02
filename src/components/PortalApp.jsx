"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { PrincipalView } from "./PrincipalView";
import { TeacherView } from "./TeacherView";
import { StudentView } from "./StudentView";

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

const api = {
    async get(endpoint, requireAuth = true) {
        const headers = { "Content-Type": "application/json" };
        if (requireAuth) {
            const token = getAuthToken();
            if (token) headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}${endpoint}`, { headers });
        return response.json();
    },

    async post(endpoint, data, requireAuth = true) {
        const headers = { "Content-Type": "application/json" };
        if (requireAuth) {
            const token = getAuthToken();
            if (token) headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}${endpoint}`, {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        });
        return response.json();
    }
};

export function PortalApp({ role = "principal" }) {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeClass, setActiveClass] = useState("JS1");
    const [activeSubject, setActiveSubject] = useState("Mathematics");
    const [availableClasses, setAvailableClasses] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [feeHistory, setFeeHistory] = useState([]);
    const [activeTab, setActiveTab] = useState("results");
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("studentId");
        const logoutPath = role === "teacher" ? "/teacher/login" : role === "student" ? "/student/login" : "/admin/login";
        router.push(logoutPath);
    };

    const [studentForm, setStudentForm] = useState({
        admissionNo: "",
        firstName: "",
        lastName: "",
        middleName: "",
        classId: "",
        className: "",
        arm: "A",
        guardianName: "",
        guardianPhone: "",
        track: "junior",
        documentation: ""
    });

    const [teacherForm, setTeacherForm] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        email: "",
        phone: "",
        roleTitle: "Class Teacher",
        documentation: ""
    });

    const [complaint, setComplaint] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                if (role === "principal") {
                    const [studentsData, teachersData, classesData] = await Promise.all([
                        api.get("/students"),
                        api.get("/teachers"),
                        api.get("/classes", false)
                    ]);
                    setStudents(Array.isArray(studentsData) ? studentsData : []);
                    setTeachers(Array.isArray(teachersData) ? teachersData : []);
                    setAvailableClasses(Array.isArray(classesData) ? classesData : []);
                } else if (role === "teacher") {
                    const [studentsData, scoresData, classesData] = await Promise.all([
                        api.get("/students"),
                        api.get("/scores"),
                        api.get("/classes", false)
                    ]);
                    setStudents(Array.isArray(studentsData) ? studentsData : []);
                    setScores(Array.isArray(scoresData) ? scoresData : []);
                    setAvailableClasses(Array.isArray(classesData) ? classesData : []);
                } else if (role === "student") {
                    const studentId = localStorage.getItem("studentId");
                    if (studentId) {
                        const [profileData, feesData, complaintsData] = await Promise.all([
                            api.get(`/students/${studentId}/profile`),
                            api.get(`/students/${studentId}/fees`),
                            api.get(`/students/${studentId}/complaints`)
                        ]);
                        if (profileData?.data) setStudents([profileData.data]);
                        setFeeHistory(Array.isArray(feesData?.data) ? feesData.data : []);
                        setComplaints(Array.isArray(complaintsData?.data) ? complaintsData.data : []);
                    }
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [role]);

    const addTeacher = async (event) => {
        event.preventDefault();
        try {
            const result = await api.post("/teachers", teacherForm);
            if (result.success) {
                setTeachers([result.data, ...teachers]);
                setTeacherForm({
                    firstName: "",
                    lastName: "",
                    middleName: "",
                    email: "",
                    phone: "",
                    roleTitle: "Class Teacher",
                    documentation: ""
                });
                alert("Teacher added successfully!");
            } else {
                alert(result.message || "Failed to add teacher");
            }
        } catch (error) {
            console.error("Error adding teacher:", error);
            alert("Failed to add teacher");
        }
    };

    const addStudent = async (event) => {
        event.preventDefault();
        try {
            const result = await api.post("/students", studentForm);
            if (result.success) {
                setStudents([result.data, ...students]);
                setStudentForm({
                    admissionNo: "",
                    firstName: "",
                    lastName: "",
                    middleName: "",
                    classId: "",
                    className: "",
                    arm: "A",
                    guardianName: "",
                    guardianPhone: "",
                    track: "junior",
                    documentation: ""
                });
                alert("Student added successfully!");
            } else {
                alert(result.message || "Failed to add student");
            }
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to add student");
        }
    };

    const updateScore = (index, field, value) => {
        const updatedScores = [...scores];
        updatedScores[index] = { ...updatedScores[index], [field]: value };
        setScores(updatedScores);
    };

    const finalizeScore = async (index) => {
        const score = scores[index];
        try {
            const result = await api.post("/scores", {
                studentId: score.student_id,
                subjectId: score.subject_id,
                termId: score.term_id || "temp",
                testScore: score.test_score,
                examScore: score.exam_score,
                remark: score.remark,
                finalized: true
            });
            if (result.success) {
                const updatedScores = [...scores];
                updatedScores[index].finalized = true;
                setScores(updatedScores);
                alert("Score finalized!");
            }
        } catch (error) {
            console.error("Error finalizing score:", error);
            alert("Failed to finalize score");
        }
    };

    const submitComplaint = async (event) => {
        event.preventDefault();
        if (!complaint.trim()) return;
        try {
            const result = await api.post("/complaints", { text: complaint });
            if (result.success) {
                setComplaints([result.data, ...complaints]);
                setComplaint("");
                alert("Complaint submitted successfully!");
            }
        } catch (error) {
            console.error("Error submitting complaint:", error);
            alert("Failed to submit complaint");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center text-red-600">
                    <p>Error loading data: {error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <aside className="sidebar">
                <div className="brand">
                    <div className="crest"><Icon name="shield" /></div>
                    <div>
                        <strong>Greenfield College</strong>
                        <span>Nigerian Secondary Portal</span>
                    </div>
                </div>
                <nav className="role-switcher" aria-label={`${portalLabel(role)} sections`}>
                    {portalSections(role).map(([label, icon]) => (
                        <button className="active" key={label} type="button">
                            <Icon name={icon} />
                            {label}
                        </button>
                    ))}
                </nav>
                <div className="session-card">
                    <span>Current session</span>
                    <strong>2024/2025 Third Term</strong>
                    <small>Promotion uses first, second and third term averages.</small>
                </div>
            </aside>

            <main className="main">
                <header className="topbar">
                    <div>
                        <h1>
                            {role === "principal" && "School Head Command Center"}
                            {role === "teacher" && "Teacher Workspace"}
                            {role === "student" && "Student Portal"}
                        </h1>
                        <p>
                            {role === "principal" && "Manage staffing, admissions, documentation, classes and academic oversight."}
                            {role === "teacher" && "Record scores, review assigned classes and prepare term report cards."}
                            {role === "student" && "Complete records, view results, pay fees and send protected feedback."}
                        </p>
                    </div>
                    <div className="auth-card">
                        <div>
                            <span>{role === "teacher" ? "Teacher login mode" : "Secure access"}</span>
                            <strong>{role === "teacher" ? "Email + surname + OTP" : "JWT role verified session"}</strong>
                        </div>
                        <button type="button" onClick={handleLogout} className="logout-button inline-flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
                            <Icon name="logout" />
                            Logout
                        </button>
                    </div>
                </header>

                {role === "principal" && (
                    <PrincipalView
                        stats={{
                            totalStudents: students.length,
                            totalTeachers: teachers.length,
                            juniorStudents: Array.isArray(students) ? students.filter(s => s?.track === "junior").length : 0,
                            seniorStudents: Array.isArray(students) ? students.filter(s => s?.track && s.track !== "junior").length : 0,
                            paidStudents: Array.isArray(students) ? students.filter(s => s?.status === "active").length : 0
                        }}
                        teachers={teachers}
                        students={students}
                        teacherForm={teacherForm}
                        setTeacherForm={setTeacherForm}
                        addTeacher={addTeacher}
                        studentForm={studentForm}
                        setStudentForm={setStudentForm}
                        addStudent={addStudent}
                        availableClasses={availableClasses}
                    />
                )}

                {role === "teacher" && (
                    <TeacherView
                        students={students}
                        scores={scores}
                        activeClass={activeClass}
                        setActiveClass={setActiveClass}
                        activeSubject={activeSubject}
                        setActiveSubject={setActiveSubject}
                        updateScore={updateScore}
                        finalizeScore={finalizeScore}
                    />
                )}

                {role === "student" && (
                    <StudentView
                        student={students?.[0]}
                        feeHistory={feeHistory}
                        complaint={complaint}
                        complaints={complaints}
                        setComplaint={setComplaint}
                        submitComplaint={submitComplaint}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                )}
            </main>
        </div>
    );
}

function portalLabel(role) {
    if (role === "teacher") return "Teacher portal";
    if (role === "student") return "Student portal";
    return "Principal and admin portal";
}

function portalSections(role) {
    if (role === "teacher") {
        return [
            ["Teacher overview", "dashboard"],
            ["Assigned class", "users"],
            ["Scores and reports", "book"]
        ];
    }

    if (role === "student") {
        return [
            ["Student overview", "dashboard"],
            ["Results", "book"],
            ["Fees and complaints", "money"]
        ];
    }

    return [
        ["Admin overview", "dashboard"],
        ["Staff management", "users"],
        ["Admissions", "book"],
        ["Fee tracking", "money"]
    ];
}
