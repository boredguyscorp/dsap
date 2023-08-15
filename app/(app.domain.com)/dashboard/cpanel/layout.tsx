import { DashboardShell } from '../../_components/dashboard-shell'
import { SidebarNav } from './_components/sidebar'

export default function CPanelLayout(props: { children: React.ReactNode }) {
  return (
    <DashboardShell title='Control Panel' description='Manage your website content and organization data.'>
      <div className='flex flex-1 gap-12'>
        <aside className='hidden w-52 flex-col md:flex'>
          <SidebarNav />
        </aside>
        <main className='flex flex-1 flex-col overflow-hidden'>{props.children}</main>
      </div>
    </DashboardShell>
  )
}
