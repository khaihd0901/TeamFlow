import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export const iframeHeight = "1000px"

export const description = "A sidebar with a header and a search form."

export default function Layout() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="px-4 py-4">
              <main><Outlet/></main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
