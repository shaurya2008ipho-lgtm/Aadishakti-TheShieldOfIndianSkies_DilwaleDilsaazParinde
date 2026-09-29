import type { ReactNode } from 'react'

export function Panel({ title, children, className = '', action }: { title: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return <section className={`panel ${className}`}>
    <div className="panel-head"><h3>{title}</h3>{action}</div>
    {children}
  </section>
}
