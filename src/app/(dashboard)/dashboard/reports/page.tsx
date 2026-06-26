import { FileDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export const dynamic = "force-dynamic";
export default function ReportsPage() {
  const reports = [
    {
      title: "BEAC AML transaction export",
      description:
        "Daily Mobile Money transactions with subscriber, product, amount, reference and status fields.",
    },
    {
      title: "Network SLA compensation report",
      description:
        "PNQM triggered credits by cell sector, region, operator, threshold and payout amount.",
    },
    {
      title: "ML prediction audit report",
      description:
        "LSTM model version, prediction probability, actual outcome, false positives and feedback status.",
    },
    {
      title: "USSD usage report",
      description:
        "Feature-phone menu usage, issue reports, credit lookup and help requests.",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Reports & compliance center</CardTitle>
            <CardDescription>
              Generate management reports and regulatory audit files from
              SmartConnect operational data.
            </CardDescription>
          </div>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <div
              key={report.title}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <ShieldCheck className="h-7 w-7 text-brand-teal" />
              <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
                {report.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {report.description}
              </p>
              <Button className="mt-4" variant="outline">
                <FileDown className="h-4 w-4" /> Generate
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
