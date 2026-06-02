export function Panel({ title, action, children }) {
    return (
        <section className="panel">
            <div className="panel-head">
                <h2>{title}</h2>
                <span>{action}</span>
            </div>
            {children}
        </section>
    );
}
