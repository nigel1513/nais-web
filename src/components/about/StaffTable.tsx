import type { StaffRow } from "@/content/organization";

export function StaffTable({ rows }: { rows: StaffRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left text-[15px]">
        <thead>
          <tr className="text-[13px] text-muted">
            <th scope="col" className="w-36 pb-3 font-normal">직위</th>
            <th scope="col" className="pb-3 font-normal">담당업무</th>
            <th scope="col" className="w-40 pb-3 text-right font-normal">전화</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.phone}-${i}`} className="border-t border-white/[0.07] align-top">
              <td className="py-4 pr-4 font-medium">{row.role}</td>
              <td className="py-4 pr-6">
                <ul className="space-y-1 leading-relaxed text-fg/85">{row.duties.map((d) => <li key={d}>{d}</li>)}</ul>
              </td>
              <td className="py-4 text-right font-mono text-sm tabular-nums text-muted">
                <a href={`tel:${row.phone}`} className="hover:text-cyan">{row.phone}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
