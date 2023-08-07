import { DashboardShell } from '../../_components/dashboard-shell'
import { SidebarNav } from './_components/sidebar'

export default function SettingsLayout(props: { children: React.ReactNode; params: { organizationId: string } }) {
  return (
    <DashboardShell title='Organization' description='Manage your organization'>
      <div className='flex flex-1 gap-12'>
        <aside className='hidden w-52 flex-col md:flex'>
          <SidebarNav />
        </aside>
        <main className='flex flex-1 flex-col overflow-hidden'>{props.children}</main>
      </div>
    </DashboardShell>
  )
}
