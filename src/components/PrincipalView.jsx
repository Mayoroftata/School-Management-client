import { Metric } from "./Metric";
import { Panel } from "./Panel";
import { DataTable } from "./DataTable";
import { Icon } from "./Icon";

export function PrincipalView({ stats, teachers, students, teacherForm, setTeacherForm, addTeacher, studentForm, setStudentForm, addStudent, availableClasses }) {
    const dashboardStats = {
        paid: stats.paidStudents || 0,
        seniors: stats.seniorStudents || 0,
        juniors: stats.juniorStudents || 0,
        unpaid: (stats.totalStudents || 0) - (stats.paidStudents || 0)
    };

    return (
        <section className="grid-stack">
            <div className="metric-grid">
                <Metric icon="users" label="Total students" value={stats.totalStudents || 0} detail={`${dashboardStats.juniors} junior, ${dashboardStats.seniors} senior`} />
                <Metric icon="book" label="Teaching staff" value={stats.totalTeachers || 0} detail="Allocated by class and subject" />
                <Metric icon="money" label="Fee compliance" value={`${stats.totalStudents ? Math.round((dashboardStats.paid / stats.totalStudents) * 100) : 0}%`} detail={`${dashboardStats.unpaid} payment records need attention`} />
                <Metric icon="shield" label="Active classes" value={Array.isArray(availableClasses) ? availableClasses.length : 0} detail="JS1 to SS3 with tracks" />
            </div>

            <div className="two-column">
                <Panel title="Register teacher" action="Staff file">
                    <form className="form-grid" onSubmit={addTeacher}>
                        <input placeholder="First name" value={teacherForm.firstName} onChange={(e) => setTeacherForm({ ...teacherForm, firstName: e.target.value })} required />
                        <input placeholder="Last name" value={teacherForm.lastName} onChange={(e) => setTeacherForm({ ...teacherForm, lastName: e.target.value })} required />
                        <input placeholder="Middle name" value={teacherForm.middleName} onChange={(e) => setTeacherForm({ ...teacherForm, middleName: e.target.value })} />
                        <input placeholder="Email" type="email" value={teacherForm.email} onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })} required />
                        <input placeholder="Phone" value={teacherForm.phone} onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })} />
                        <input placeholder="Role title" value={teacherForm.roleTitle} onChange={(e) => setTeacherForm({ ...teacherForm, roleTitle: e.target.value })} required />
                        <input placeholder="Documentation" value={teacherForm.documentation} onChange={(e) => setTeacherForm({ ...teacherForm, documentation: e.target.value })} />
                        <button className="primary" type="submit"><Icon name="edit" /> Add teacher</button>
                    </form>
                </Panel>

                <Panel title="Register student" action="Admission file">
                    <form className="form-grid" onSubmit={addStudent}>
                        <input placeholder="Admission No (optional)" value={studentForm.admissionNo} onChange={(e) => setStudentForm({ ...studentForm, admissionNo: e.target.value })} />
                        <input placeholder="First name" value={studentForm.firstName} onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })} required />
                        <input placeholder="Last name" value={studentForm.lastName} onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })} required />
                        <input placeholder="Middle name" value={studentForm.middleName} onChange={(e) => setStudentForm({ ...studentForm, middleName: e.target.value })} />
                        <select value={studentForm.track} onChange={(e) => setStudentForm({ ...studentForm, track: e.target.value })}>
                            <option value="junior">Junior Secondary</option>
                            <option value="science">Science</option>
                            <option value="commercial">Commercial</option>
                            <option value="art">Art</option>
                        </select>
                        <input placeholder="Class name (e.g., JS1, SS1 Science)" value={studentForm.className} onChange={(e) => setStudentForm({ ...studentForm, className: e.target.value })} />
                        <input placeholder="Arm" value={studentForm.arm} onChange={(e) => setStudentForm({ ...studentForm, arm: e.target.value })} />
                        <input placeholder="Guardian name" value={studentForm.guardianName} onChange={(e) => setStudentForm({ ...studentForm, guardianName: e.target.value })} required />
                        <input placeholder="Guardian phone" value={studentForm.guardianPhone} onChange={(e) => setStudentForm({ ...studentForm, guardianPhone: e.target.value })} />
                        <input placeholder="Documentation" value={studentForm.documentation} onChange={(e) => setStudentForm({ ...studentForm, documentation: e.target.value })} />
                        <button className="primary" type="submit"><Icon name="edit" /> Register student</button>
                    </form>
                </Panel>
            </div>

            <div className="two-column wide-left">
                <Panel title="Students and documentation" action="Admissions">
                    <DataTable
                        columns={["Student", "Class", "Track", "Status", "Documents"]}
                        rows={Array.isArray(students) ? students.slice(0, 10).map((student) => [
                            `${student?.first_name || student?.firstName || ""} ${student?.last_name || student?.lastName || ""}`,
                            student?.class_name || student?.current_class || student?.className || "N/A",
                            student?.track || "N/A",
                            student?.status || "Active",
                            student?.documents ? "Yes" : "No"
                        ]) : []}
                    />
                </Panel>
                <Panel title="Staff allocation" action="Timetable">
                    <div className="staff-list">
                        {Array.isArray(teachers) && teachers.slice(0, 5).map((teacher) => (
                            <article className="staff-row" key={teacher?.id}>
                                <div>
                                    <strong>{teacher?.first_name || teacher?.firstName} {teacher?.last_name || teacher?.lastName}</strong>
                                    <span>{teacher?.email}</span>
                                </div>
                                <div>
                                    <b>{teacher?.role_title || teacher?.roleTitle || "Teacher"}</b>
                                    <span>{teacher?.specialization || "General"}</span>
                                </div>
                            </article>
                        ))}
                        {(!teachers || teachers.length === 0) && (
                            <p className="text-gray-500 text-center py-4">No teachers added yet</p>
                        )}
                    </div>
                </Panel>
            </div>
        </section>
    );
}
