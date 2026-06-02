import { Icon } from "./Icon";

export function Metric({ icon, label, value, detail }) {
    return (
        <article className="metric-card">
            <div className="metric-icon"><Icon name={icon} /></div>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{detail}</p>
        </article>
    );
}
