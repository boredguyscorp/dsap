import { DashboardShell } from '../../_components/dashboard-shell'

export default function SettingsLayout(props: { children: React.ReactNode; params: { organizationId: string } }) {
  return (
    <DashboardShell title='Apps' description='Your Business Apps goes here...'>
      <div className='flex gap-12'>
        <main className='flex flex-col overflow-hidden'>{props.children}</main>
      </div>
    </DashboardShell>
  )
}
