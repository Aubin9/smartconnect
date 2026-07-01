import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json({
    openapi: "3.0.3",
    info: {
      title: "SmartConnect API",
      version: "1.0.0",
      description:
        "API contract for PNQM network intelligence and CDWM financial services.",
    },
    paths: {
      "/api/network/kpi": {
        get: {
          summary: "Fetch dashboard statistics, live KPIs and recent actions",
        },
      },
      "/api/network/cells": {
        get: { summary: "Fetch cell sectors with latest KPI and prediction" },
      },
      "/api/network/prediction": {
        get: { summary: "List predictions" },
        post: { summary: "Run congestion prediction" },
      },
      "/api/subscribers": { get: { summary: "List subscribers" } },
      "/api/subscribers/{id}": { get: { summary: "Get subscriber details" } },
      "/api/financial/credit": {
        post: {
          summary: "Apply automatic or manual network compensation credit",
        },
      },
      "/api/financial/loan": {
        post: { summary: "Evaluate and process SME micro-loan request" },
      },
      "/api/financial/insurance": {
        post: { summary: "Opt in, opt out or claim connectivity insurance" },
      },
      "/api/ml/predict": { post: { summary: "Run ML congestion prediction" } },
      "/api/ml/performance": {
        get: { summary: "Fetch model performance dashboard data" },
      },
    },
  });
}
