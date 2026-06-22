import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatDate from "@/helper/formatDate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { TransactionType } from "@/types/transactionType";
import { DashboardType } from "@/types/userType";
import Link from "next/link";

export function RecentTransaction({
  transactionData,
  userdata,
}: {
  transactionData: TransactionType[];
  userdata: DashboardType;
}) {
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Recent transactions from your account.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/dashboard/transaction">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Info</TableHead>
              <TableHead className="hidden xl:table-column">Type</TableHead>
              <TableHead className="hidden xl:table-column">Status</TableHead>
              <TableHead className="hidden xl:table-column">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionData?.map((data) => (
              <TableRow key={data.id}>
                <TableCell>
                  <div className="font-sm">{formatDate(data?.date)}</div>
                  <div className="font-medium">
                    {data.type + "/" + userdata?.name + "/" + data.acc_no}
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {data.type + "-" + data.id}
                  </div>
                </TableCell>

                <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                  {formatDate(data.date)}
                </TableCell>
                {data.method === "CREDIT" ? (
                  <TableCell className="text-right">
                    {`+ ₹${data.amount}`}
                  </TableCell>
                ) : (
                  <TableCell className="text-right text-red-500">
                    {`- ₹${data.amount}`}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
