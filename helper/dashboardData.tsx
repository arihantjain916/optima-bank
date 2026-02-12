"use client";
import { Package2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const dashboardData = [
  {
    id: 1,
    path: "/dashboard",
    isActive: false,
    icon: Package2,
    type: "icon",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard",
    isActive: false,
  },
  {
    id: 3,
    name: "Profile",
    path: "/dashboard/profile",
    isActive: false,
  },
  {
    id: 4,
    name: "Transaction",
    path: "/dashboard/transaction",
    isActive: false,
  },
  {
    id: 5,
    name: "Analytics",
    path: "/dashboard/analytics",
    isActive: false,
  },
  {
    id: 6,
    name: " Fund Transfer",
    path: "/dashboard/transfer",
    isActive: false,
  },
  {
    id: 7,
    name: "Card Info",
    path: "/dashboard/card",
    isActive: false,
  },
];

export default function DashboardHeaderData() {
  const pathname = usePathname();
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full ">
      {dashboardData?.map((item) => (
        <Link
          key={item.id}
          href={`${item.path}`}
          className={
            item.type == "icon"
              ? "flex items-center gap-2 text-lg font-semibold md:text-base"
              : pathname == item.path
                ? "text-foreground transition-colors hover:text-foreground"
                : "text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {item?.icon && <item.icon className="h-6 w-6" />}
          {item?.name && item?.name}
        </Link>
      ))}
    </nav>
  );
}
