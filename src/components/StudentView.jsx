import { Metric } from "./Metric";
import { Panel } from "./Panel";
import { DataTable } from "./DataTable";
import { Icon } from "./Icon";
import { StudentDocumentation } from "./StudentDocumentation";

export function StudentView({ student, feeHistory, complaint, complaints, setComplaint, submitComplaint, activeTab, setActiveTab }) {
    const fullName = student ? `${student?.first_name || student?.firstName || ''} ${student?.last_name || student?.lastName || ''}` : 'Student';
    const admissionNumber = student?.admission_no || student?.admissionNumber || 'N/A';
    const className = student?.class_name || student?.current_class || student?.className || 'N/A';
    const track = student?.track || 'N/A';
    const average = student?.average || 0;
    const studentId = student?.id;

    return (
        <section className="grid-stack">
            <div className="student-banner">
                <div>
                    <h2>{fullName}</h2>
                    <p>{admissionNumber} · {className} · Third Term 2024/2025</p>
                </div>
                <button className="primary"><Icon name="book" /> Download report card</button>
            </div>

            <div className="border-b border-gray-200 mb-6">
                <nav className="flex gap-4">
                    <button
                        onClick={() => setActiveTab("results")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "results"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        📊 Results & Performance
                    </button>
                    <button
                        onClick={() => setActiveTab("documents")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "documents"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        📄 Documentation
                    </button>
                    <button
                        onClick={() => setActiveTab("fees")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "fees"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        💰 Fees & Payments
                    </button>
                    <button
                        onClick={() => setActiveTab("complaints")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "complaints"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        🔒 Anonymous Complaint
                    </button>
                </nav>
            </div>

            {activeTab === "results" && (
                <>
                    <div className="metric-grid">
                        <Metric icon="book" label="Cumulative average" value={`${average}%`} detail={promotionText(average)} />
                        <Metric icon="money" label="Fee status" value="Pending" detail="Third term payment record" />
                        <Metric icon="shield" label="Track" value={track} detail="Academic specialization" />
                        <Metric icon="alert" label="Anonymous reports" value={Array.isArray(complaints) ? complaints.length : 0} detail="Protected complaint log" />
                    </div>

                    <Panel title="Academic Timeline" action="Nigeria 6-year structure">
                        <div className="timeline">
                            {["JS1", "JS2", "JS3", "SS1", "SS2", "SS3"].map((level, index) => (
                                <div className={index <= 3 ? "passed" : ""} key={level}>
                                    <span>{level}</span>
                                    <small>{index < 3 ? "Junior secondary" : index === 3 ? track : "Senior secondary"}</small>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </>
            )}

            {activeTab === "documents" && (
                <StudentDocumentation studentId={studentId} />
            )}

            {activeTab === "fees" && (
                <div className="two-column">
                    <Panel title="Payment history" action="School fees">
                        {Array.isArray(feeHistory) && feeHistory.length > 0 ? (
                            <DataTable
                                columns={["Term", "Amount", "Method", "Status", "Date"]}
                                rows={feeHistory.map((fee) => [
                                    fee?.term_name || fee?.term,
                                    `₦${fee?.amount?.toLocaleString() || '0'}`,
                                    fee?.payment_method || fee?.method || 'N/A',
                                    fee?.status || 'Pending',
                                    fee?.paid_at ? new Date(fee.paid_at).toLocaleDateString() : fee?.date || 'N/A'
                                ])}
                            />
                        ) : (
                            <p className="text-gray-500 text-center py-4">No payment history available</p>
                        )}
                        <button className="primary payment"><Icon name="money" /> Pay current fee</button>
                    </Panel>
                </div>
            )}

            {activeTab === "complaints" && (
                <div className="two-column">
                    <Panel title="Anonymous complaint" action="Student care">
                        <form className="complaint-form" onSubmit={submitComplaint}>
                            <textarea
                                placeholder="Describe the issue without adding your name unless you choose to."
                                value={complaint}
                                onChange={(e) => setComplaint(e.target.value)}
                                rows="4"
                            />
                            <button className="primary" type="submit"><Icon name="alert" /> Submit privately</button>
                        </form>
                        <div className="complaint-list mt-6">
                            <h3 className="font-semibold mb-3">Previous Complaints</h3>
                            {Array.isArray(complaints) && complaints.slice(0, 5).map((item) => (
                                <article key={item?.id} className="border-b pb-3 mb-3">
                                    <p className="text-sm">{item?.complaint_text || item?.text}</p>
                                    <div className="flex gap-3 mt-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${item?.status === 'resolved' ? 'bg-green-100 text-green-700' : item?.status === 'in_review' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                            {item?.status || 'Open'}
                                        </span>
                                        <small className="text-xs text-gray-500">
                                            {item?.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                                        </small>
                                    </div>
                                </article>
                            ))}
                            {(!complaints || complaints.length === 0) && (
                                <p className="text-gray-500 text-center py-4">No complaints submitted yet</p>
                            )}
                        </div>
                    </Panel>
                </div>
            )}
        </section>
    );
}

function promotionText(average) {
    if (average >= 75) return "Excellent promotion standing";
    if (average >= 60) return "Promotion likely with review";
    if (average > 0) return "Needs intervention plan";
    return "Awaiting term scores";
}
