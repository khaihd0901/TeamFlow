import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { Outlet } from "react-router";
import ChatBox from "../chat/ChatBox";
import { ChatContext } from "@/lib/ChatContext";
export const iframeHeight = "1000px";

export const description = "A sidebar with a header and a search form.";

export default function Layout() {
  const [openChatBox, setOpenChatBox] = useState(false);
  return (
    <ChatContext.Provider value={{ setOpenChatBox }}>
      <div className="[--header-height:calc(--spacing(14))] ">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1 relative">
            <AppSidebar />
            <SidebarInset>
              <div className="px-4 py-4">
                <main>
                  <Outlet />
                </main>
              </div>
            </SidebarInset>

            {openChatBox && (
              <div className="fixed bottom-5 right-5 z-50 w-sm h-[400px] flex items-center justify-center">
                {" "}
                <ChatBox onClose={() => setOpenChatBox(false)} />
              </div>
            )}
          </div>
        </SidebarProvider>
      </div>
    </ChatContext.Provider>
  );
}
