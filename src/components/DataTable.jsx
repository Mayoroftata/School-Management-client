export function DataTable({ columns, rows }) {
    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
                </thead>
                <tbody>
                    {Array.isArray(rows) && rows.map((row, index) => (
                        <tr key={index}>{row.map((cell, cellIndex) => <td key={`${index}-${cellIndex}`} data-label={columns[cellIndex]}>{cell || '-'}</td>)}</tr>
                    ))}
                    {(!rows || rows.length === 0) && (
                        <tr><td colSpan={columns.length} className="text-center py-4 text-gray-500">No data available</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
