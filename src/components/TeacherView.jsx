import { Panel } from "./Panel";
import { DataTable } from "./DataTable";
import { Icon } from "./Icon";

export function TeacherView({ students, scores, activeClass, setActiveClass, activeSubject, setActiveSubject, updateScore, finalizeScore }) {
    const classOptions = ["JS1", "JS2", "JS3", "SS1", "SS2", "SS3"];
    const subjectOptions = ["Mathematics", "English Language", "Physics", "Chemistry", "Biology", "Economics", "Accounting", "Literature", "Government"];

    const visibleStudents = Array.isArray(students) ? students.filter((student) =>
        student?.current_class === activeClass ||
        student?.class_name === activeClass ||
        `${student?.class} ${student?.arm}` === activeClass
    ) : [];

    const filteredScores = Array.isArray(scores) ? scores.filter(score =>
        score?.subject_name === activeSubject || score?.subject === activeSubject
    ) : [];

    return (
        <section className="grid-stack">
            <div className="teacher-hero">
                <div>
                    <h2>Assigned classes and subject scores</h2>
                    <p>Teachers use their registered email and surname with a one-time passcode for each login attempt, then manage scores for allocated classes.</p>
                </div>
                <div className="otp-box">
                    <span>OTP delivery</span>
                    <strong>teacher@school.edu.ng</strong>
                    <small>Expires in 10 minutes after request</small>
                </div>
            </div>

            <div className="filter-bar">
                <select value={activeClass} onChange={(e) => setActiveClass(e.target.value)}>
                    {classOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
                <select value={activeSubject} onChange={(e) => setActiveSubject(e.target.value)}>
                    {subjectOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
            </div>

            <div className="two-column wide-left">
                <Panel title="Allocated class register" action={activeClass}>
                    <DataTable
                        columns={['Student', 'Admission No.', 'Status', 'Average']}
                        rows={visibleStudents.slice(0, 10).map((student) => [
                            `${student?.first_name || student?.firstName || ''} ${student?.last_name || student?.lastName || ''}`,
                            student?.admission_no || student?.admissionNumber || 'N/A',
                            student?.status || 'Active',
                            `${student?.average || 0}%`
                        ])}
                    />
                    {visibleStudents.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No students in this class</p>
                    )}
                </Panel>
                <Panel title="Report-card readiness" action="Third term">
                    <div className="readiness">
                        <div style={{ "--value": "82%" }}><span /></div>
                        <strong>82%</strong>
                        <p>of assigned reports have score entries, remarks and class-teacher review.</p>
                    </div>
                </Panel>
            </div>

            <Panel title="Score entry and final remarks" action={activeSubject}>
                <div className="score-grid">
                    {filteredScores.length > 0 ? (
                        filteredScores.map((score, index) => (
                            <article className="score-card" key={`${score?.student_id}-${score?.subject_id}`}>
                                <div className="score-card-head">
                                    <div>
                                        <strong>{score?.student_name || score?.student}</strong>
                                        <span>{score?.class_name || score?.class} · {score?.subject_name || score?.subject}</span>
                                    </div>
                                    <em className={score?.finalized ? "done" : "open"}>{score?.finalized ? "Finalized" : "Open"}</em>
                                </div>
                                <div className="score-inputs">
                                    <label>Test (0-40)
                                        <input
                                            type="number"
                                            value={score?.test_score || score?.test || 0}
                                            onChange={(e) => updateScore(index, "test_score", parseInt(e.target.value))}
                                            min="0" max="40"
                                            disabled={score?.finalized}
                                        />
                                    </label>
                                    <label>Exam (0-60)
                                        <input
                                            type="number"
                                            value={score?.exam_score || score?.exam || 0}
                                            onChange={(e) => updateScore(index, "exam_score", parseInt(e.target.value))}
                                            min="0" max="60"
                                            disabled={score?.finalized}
                                        />
                                    </label>
                                    <label>Total
                                        <input
                                            type="number"
                                            value={(score?.test_score || score?.test || 0) + (score?.exam_score || score?.exam || 0)}
                                            readOnly
                                        />
                                    </label>
                                </div>
                                <textarea
                                    value={score?.remark || score?.remarks || ""}
                                    onChange={(e) => updateScore(index, "remark", e.target.value)}
                                    aria-label="Teacher remark"
                                    placeholder="Enter remarks for this student..."
                                    disabled={score?.finalized}
                                />
                                {!score?.finalized && (
                                    <button className="secondary" onClick={() => finalizeScore(index)}>
                                        <Icon name="shield" /> Finalize report card
                                    </button>
                                )}
                            </article>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-8">No scores available for this subject and class</p>
                    )}
                </div>
            </Panel>
        </section>
    );
}
