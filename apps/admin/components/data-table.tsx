import Link from 'next/link';

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<{ href?: string; cells: Array<string | number> }>;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--line)]">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-[var(--surface)] text-[11px] font-semibold tracking-[0.04em] text-[var(--text-muted)] uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-3 py-2 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const inner = row.cells.map((cell, cellIndex) => (
              <td
                key={`${index}-${cellIndex}`}
                className="px-3 py-2 text-[var(--ink)]"
              >
                {cell}
              </td>
            ));
            if (row.href) {
              return (
                <tr
                  key={index}
                  className="cursor-pointer border-t border-[var(--line)] hover:bg-[var(--surface)]"
                >
                  {inner.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-0">
                      <Link href={row.href!} className="block px-3 py-2">
                        {row.cells[cellIndex]}
                      </Link>
                    </td>
                  ))}
                </tr>
              );
            }
            return (
              <tr key={index} className="border-t border-[var(--line)]">
                {inner}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
