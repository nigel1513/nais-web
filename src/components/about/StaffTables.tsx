import { ORG, flattenOrg, type OrgUnit } from "@/content/organization";

const ALL = flattenOrg(ORG);
const parentOf = (u: OrgUnit) => ALL.find((p) => p.children.some((c) => c.id === u.id));

export function StaffTables() {
  return (
    <div className="space-y-20">
      {ALL.filter((u) => u.staff.length > 0).map((u) => {
        const parent = parentOf(u);
        return (
          <section key={u.id} id={`unit-${u.id}`} aria-labelledby={`unit-${u.id}-title`} className="scroll-mt-24">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan">{u.nameEn}</p>
            <h3 id={`unit-${u.id}-title`} className="mt-2 text-2xl font-semibold tracking-[-0.02em] md:text-[1.75rem]">{u.name}</h3>
            {parent && <p className="mt-1 text-sm text-muted">{parent.name}</p>}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-left text-[15px]">
                <thead>
                  <tr className="text-[13px] text-muted">
                    <th scope="col" className="w-36 pb-3 font-normal">직위</th>
                    <th scope="col" className="pb-3 font-normal">담당업무</th>
                    <th scope="col" className="w-40 pb-3 text-right font-normal">전화</th>
                  </tr>
                </thead>
                <tbody>
                  {u.staff.map((row, i) => (
                    <tr key={`${row.phone}-${i}`} className="border-t border-white/[0.07] align-top">
                      <td className="py-4 pr-4 font-medium">{row.role}</td>
                      <td className="py-4 pr-6">
                        <ul className="space-y-1 leading-relaxed text-fg/85">
                          {row.duties.map((d) => <li key={d}>{d}</li>)}
                        </ul>
                      </td>
                      <td className="py-4 text-right font-mono text-sm tabular-nums text-muted">
                        <a href={`tel:${row.phone}`} className="hover:text-cyan">{row.phone}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
