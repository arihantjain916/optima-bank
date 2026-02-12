import Link from "next/link";
import { CircleUser, Menu, Package2, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full ">
        <Link
          href={`/dashboard`}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
        </Link>
        <Link
          href={`/dashboard`}
          className="text-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </Link>
        <Link
          href={`/dashboard/profile`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Profile
        </Link>
        <Link
          href={`/dashboard/transaction`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Transaction
        </Link>
        <Link
          href={`/dashboard/analytics`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Analytics
        </Link>
        <Link
          href={`/dashboard/transfer`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Fund Transfer
        </Link>
        <Link
          href={`/dashboard/card`}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Card Info
        </Link>
      </nav>
      {/* Hamburger Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href={`/dashboard`}
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Optima Bank</span>
            </Link>
            <Link href={`/dashboard`} className="hover:text-foreground">
              Dashboard
            </Link>
            <Link
              href={`/dashboard/profile`}
              className="text-muted-foreground hover:text-foreground"
            >
              Profile
            </Link>
            <Link
              href={`/dashboard/transaction`}
              className="text-muted-foreground hover:text-foreground"
            >
              Transaction
            </Link>
            <Link
              href={`/dashboard/analytics}`}
              className="text-muted-foreground hover:text-foreground"
            >
              Analytics
            </Link>
            <Link
              href={`/dashboard/transfer`}
              className="text-muted-foreground hover:text-foreground whitespace-nowrap"
            >
              Fund Transfer
            </Link>
            <Link
              href={`/dashboard/card`}
              className="text-muted-foreground hover:text-foreground"
            >
              Card Info
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Transaction"
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
