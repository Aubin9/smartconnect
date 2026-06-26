import { Download, FileText } from "lucide-react";
import {
  LoanPie,
  InsuranceBar,
  TrustTopupScatter,
} from "@/components/shared/charts/FinancialTrends";
import { DataTable } from "@/components/desktop/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { financialService } from "@/lib/services/financial.service";
import { formatDateTime, formatXaf } from "@/lib/utils/formatters";
export const dynamic = "force-dynamic";
export default async function FinancialPage() {
  const summary = await financialService.getFinancialSummary();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm font-bold text-slate-500">
            Total credits disbursed
          </p>
          <p className="mt-3 text-3xl font-black">
            {formatXaf(summary.totalCreditsDisbursed)}
          </p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-slate-500">Loans approved</p>
          <p className="mt-3 text-3xl font-black">{summary.loansApproved}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-slate-500">Loans rejected</p>
          <p className="mt-3 text-3xl font-black">{summary.loansRejected}</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-slate-500">Insurance payouts</p>
          <p className="mt-3 text-3xl font-black">
            {formatXaf(summary.insurancePayouts)}
          </p>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <LoanPie
          approved={summary.loansApproved}
          rejected={summary.loansRejected}
        />
        <InsuranceBar />
        <TrustTopupScatter data={summary.trustTopupScatter} />
      </section>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent financial transactions</CardTitle>
            <CardDescription>
              Mobile Money references, transaction state, BEAC-ready audit
              trail.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" /> CSV
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4" /> BEAC report
            </Button>
          </div>
        </CardHeader>
        <DataTable
          data={summary.transactions.map((transaction) => ({
            id: transaction.id,
            timestamp: transaction.timestamp,
            subscriber: transaction.subscriber.msisdn,
            product: transaction.type,
            amount: transaction.amount,
            status: transaction.status,
            ref: transaction.mobileMoneyRef ?? "N/A",
            provider: transaction.mobileMoneyProvider ?? "Internal",
          }))}
          columns={[
            {
              key: "timestamp",
              header: "Timestamp",
              render: (row) => (
                <span className="mono text-xs">
                  {formatDateTime(row.timestamp)}
                </span>
              ),
            },
            {
              key: "subscriber",
              header: "Subscriber",
              render: (row) => (
                <span className="mono font-bold">{row.subscriber}</span>
              ),
            },
            {
              key: "product",
              header: "Product",
              render: (row) => (
                <Badge tone="info">{row.product.replaceAll("_", " ")}</Badge>
              ),
            },
            {
              key: "amount",
              header: "Amount",
              render: (row) => formatXaf(row.amount),
            },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status} />,
            },
            {
              key: "ref",
              header: "Mobile Money Ref",
              render: (row) => <span className="mono text-xs">{row.ref}</span>,
            },
            {
              key: "provider",
              header: "Provider",
              render: (row) => row.provider,
            },
          ]}
        />
      </Card>
    </div>
  );
}
