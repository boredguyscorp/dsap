import { SidebarNav } from './settings/_components/sidebar'

export default function OrganizationLayout(props: { children: React.ReactNode; params: { organizationId: string } }) {
  return (
    <>
      <div className='flex flex-1 gap-12'>
        {/* <aside className='hidden w-52 flex-col md:flex'>
          <SidebarNav />
        </aside> */}
        <main className='flex flex-1 flex-col overflow-hidden'>{props.children}</main>
      </div>
    </>
  )
}
