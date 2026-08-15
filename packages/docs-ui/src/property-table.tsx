type PropertyTableProps = {
  rows: Array<{ label: string; value: string }>;
};

export function PropertyTable({ rows }: PropertyTableProps) {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card">
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-fd-border last:border-b-0"
            >
              <th className="w-[36%] px-4 py-3 align-top font-medium text-fd-muted-foreground">
                {row.label}
              </th>
              <td className="px-4 py-3 text-fd-foreground">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
