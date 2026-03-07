/**
 * Data display patterns: cards, badges, avatars, tooltips, dropdown menus.
 *
 * Demonstrates: Card, Badge, Avatar, Tooltip, DropdownMenu, Separator, EmptyState
 */

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@chesapeake/stack/components/ui/avatar";
import { Badge } from "@chesapeake/stack/components/ui/badge";
import { Button } from "@chesapeake/stack/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@chesapeake/stack/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@chesapeake/stack/components/ui/dropdown-menu";
import { Separator } from "@chesapeake/stack/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@chesapeake/stack/components/ui/tooltip";
import { EmptyState } from "@chesapeake/stack/components/ux/EmptyState";
import { MoreHorizontal, Mail, UserPlus, Ban } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  status: "active" | "away" | "offline";
}

const members: TeamMember[] = [
  {
    name: "Alice Chen",
    role: "Engineering",
    avatar: "https://i.pravatar.cc/40?u=alice",
    status: "active",
  },
  { name: "Bob Martinez", role: "Design", status: "away" },
  {
    name: "Carol Kim",
    role: "Product",
    avatar: "https://i.pravatar.cc/40?u=carol",
    status: "active",
  },
  { name: "Dave Patel", role: "Engineering", status: "offline" },
];

const statusBadge: Record<
  TeamMember["status"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  away: "secondary",
  offline: "outline",
};

function MemberRow({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-9 w-9">
                {member.avatar && (
                  <AvatarImage src={member.avatar} alt={member.name} />
                )}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>{member.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          <p className="text-sm font-medium">{member.name}</p>
          <p className="text-xs text-muted-foreground">{member.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={statusBadge[member.status]}>{member.status}</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" /> Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserPlus className="mr-2 h-4 w-4" /> Add to team
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Ban className="mr-2 h-4 w-4" /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function DataDisplayExample() {
  return (
    <div className="max-w-lg mx-auto space-y-6 p-8">
      {/* Team member list */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>{members.length} people</CardDescription>
          <CardAction>
            <Button size="sm">Invite</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {members.map((member, i) => (
            <div key={member.name}>
              <MemberRow member={member} />
              {i < members.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Empty state */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No notifications"
            description="You're all caught up."
          />
        </CardContent>
      </Card>

      {/* Badge variants */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Variants</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
