import * as React from "react";
import { Frame, HandshakeIcon, Map, PieChart } from "lucide-react";

import { NavProjects } from "@/components/layout/nav-projects";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NewGroupChat from "../chat/NewGroupChat";
import AddFriend from "../chat/AddFriend";
import { useAuthStore } from "@/stores/authStore";
import PrivateChatList from "../chat/PrivateChatList";
import GroupChatList from "../chat/GroupChatList";

const data = {
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { user } = useAuthStore();
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <HandshakeIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">TeamFlow</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Group Chat */}
        <SidebarGroup>
          <SidebarGroupLabel
            className={`uppercase font-bold text-sm text-gray-950`}
          >
            group chat
            <SidebarGroupAction
              title="create group"
              className={`cursor-pointer`}
            >
              <NewGroupChat />
            </SidebarGroupAction>
          </SidebarGroupLabel>
          <SidebarGroup>
            <GroupChatList />
          </SidebarGroup>
        </SidebarGroup>
        {/* Private Chat */}
        <SidebarGroup>
          <SidebarGroupLabel
            className={`uppercase font-bold text-sm text-gray-950`}
          >
            friend
            <SidebarGroupAction
              title="create group"
              className={`cursor-pointer`}
            >
              <AddFriend />
            </SidebarGroupAction>
          </SidebarGroupLabel>
          <SidebarGroup>
            <PrivateChatList />
          </SidebarGroup>
        </SidebarGroup>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
