# SmartConnect VAS Platform

SmartConnect is a full-stack demonstration platform for a dual-layer telecom Value Added Service (VAS) designed for Cameroonian operators. It combines:

1. **PNQM — Predictive Network Quality Manager**: monitors radio KPIs, predicts congestion, sends alerts, and applies automatic compensation when QoE falls below SLA.
2. **CDWM — Contextual Digital Wallet and Micro-Insurance Engine**: evaluates subscriber trust scores and automatically triggers airtime bridge, insurance payout, SME micro-loans, travel booster and family bundle guard flows.

The implementation uses **Next.js 14 App Router**, **TypeScript**, **PostgreSQL**, **Prisma ORM**, **NextAuth.js**, **Tailwind CSS**, **TanStack Query**, **Recharts**, **Leaflet**, and a deterministic ML/rule-engine simulation suitable for academic demonstration and production extension.

---

## 1. Architecture

```text
SmartConnect
├── Data ingestion layer
│   ├── Cell sector KPIs: RSRP, SINR, PRB, CQI, throughput percentiles
│   ├── Subscriber app/device SDK data
│   ├── OSS/BSS billing and ticketing data
│   └── Weather/contextual signals
├── ML and feature layer
│   ├── 5-minute rolling KPI windows
│   ├── LSTM-style congestion predictor simulation
│   └── Subscriber trust-score scoring model
├── Decision layer
│   ├── Congestion probability >= 0.75
│   ├── QoE throughput < 512 Kbps for 15+ minutes
│   └── CDWM eligibility rules
└── Fulfilment layer
    ├── Push/SMS/USSD alert simulation
    ├── Airtime/data compensation
    ├── Insurance payout
    ├── Airtime bridge
    └── Mobile Money transaction records
```

---

## 2. Implemented Features

### Operator dashboard

- Protected dashboard routes with NextAuth credentials login.
- Public landing page at `/` with clear Login, Register, Dashboard and Subscriber Portal navigation.
- Role-based redirection: subscribers go to `/mobile`; operators/admins go to `/dashboard`.
- Logout functionality from the operator dashboard and subscriber portal.
- Live network overview at `/dashboard`.
- Cameroon cell-sector map with color-coded congestion probability.
- KPI cards for active subscribers, congested cells, average trust score, credits disbursed and pending alerts.
- KPI chart for RSRP, SINR, PRB utilisation and throughput.
- Top 5 predicted congested cell sectors.
- Recent actions feed for alerts, credits, loans and insurance actions.
- Subscriber analytics page with trust score, QoE trend and simulated loan application.
- Financial dashboard with transactions, loan pie chart, insurance payout bar chart and trust/top-up scatter chart.
- ML model performance page with confusion matrix, ROC curve, feature importance, model version history and retraining schedule.
- System configuration page for PNQM and CDWM thresholds.
- Reports and compliance page for BEAC AML and SLA audit exports.

### Subscriber-responsive portal

Available under `/mobile` and designed mobile-first, while still working on desktop:

- Home dashboard with QoE meter, speed, RSRP/SINR, quick actions, active services and recent activity.
- Network quality scanner page with forecast, speed-test mockup and coverage map.
- Wallet page with balance breakdown, insurance, airtime bridge, travel booster and SME micro-loan cards.
- Alerts page with critical/warning/info alert cards.
- Profile page with trust score, USSD code, account data and privacy preferences.

### Backend/API

- `/api/network/kpi`
- `/api/network/cells`
- `/api/network/prediction`
- `/api/network/predictions`
- `/api/network/events/stream` for Server-Sent Events
- `/api/subscribers`
- `/api/subscribers/[id]`
- `/api/subscribers/[id]/trust-score`
- `/api/subscribers/[id]/actions`
- `/api/financial/credit`
- `/api/financial/loan`
- `/api/financial/insurance`
- `/api/financial/transactions`
- `/api/ml/predict`
- `/api/ml/model`
- `/api/ml/performance`
- `/api/ml/feedback`
- `/api/ml/train`
- `/api/health`

All write endpoints use Zod validation and Prisma transactions where money/credit state changes occur.

---

## 3. Important Routing Decision

The original specification placed both the operator dashboard and mobile home as route-group root pages. In Next.js App Router this creates a route conflict because route groups do not add URL segments. This implementation resolves the conflict as follows:

- Public landing page: `/`
- Operator dashboard: `/dashboard`
- Operator sections: `/dashboard/network`, `/dashboard/subscribers`, `/dashboard/financial`, `/dashboard/ml-model`, `/dashboard/settings`, `/dashboard/reports`
- Subscriber responsive portal: `/mobile`
- Subscriber pages: `/mobile/quality`, `/mobile/wallet`, `/mobile/alerts`, `/mobile/profile`

This keeps a single Next.js codebase while making the application deployable and easier to navigate for evaluators, operators, and subscribers.

---

## 4. Requirements

- Node.js 20+
- Docker Desktop or a local PostgreSQL 16 instance
- npm 10+

---

## 5. Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create local environment file
cp .env.example .env

# 3. Start PostgreSQL and Redis
 docker compose up -d

# 4. Generate Prisma client
npm run db:generate

# 5. Push schema to PostgreSQL
npm run db:push

# 6. Seed demo data
npm run db:seed

# 7. Start development server
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

Navigation after startup:

```text
/            Public landing page
/login       Login page
/register    Registration page
/dashboard   Operator/admin command center
/mobile      Subscriber responsive portal
```

---

## 6. Demo Credentials

After running the seed script:

```text
Admin:      admin@smartconnect.cm      / Password123!
Operator:   operator@smartconnect.cm   / Password123!
Subscriber: subscriber1@smartconnect.cm / Password123!
```

---

## 7. Database

The Prisma schema includes:

- Users, sessions and accounts
- Subscribers and operator users
- Cell sectors
- KPI data
- Congestion predictions
- Network quality events
- Trust score history
- Transactions
- Credits
- Loans
- Insurance policies and payouts
- Airtime bridge records
- Alerts
- ML model metadata
- ML feedback loop records

To inspect the database:

```bash
npm run db:studio
```

---

## 8. Rule Engine Logic

The CDWM rule engine is implemented in:

```text
src/lib/services/rule-engine.ts
```

Rules implemented:

- **Auto credit** when congestion probability is at least 0.75 or throughput remains below 0.512 Mbps for 15+ minutes.
- **Connectivity insurance payout** when a subscriber opted in and has 3+ hours of degraded service.
- **Airtime bridge** when balance reaches zero, trust score is at least 40 and no active bridge exists.
- **SME micro-loan** when trust score is above 70, account age is above 6 months and no outstanding loan exists.
- **Travel booster** when roaming or low-signal border-zone context is detected.
- **Family bundle guard** when a configured shared bundle falls below 10%.

Run rule-engine tests:

```bash
npm run test
```

---

## 9. ML Simulation

The LSTM predictor is represented by a deterministic service in:

```text
src/lib/services/ml.service.ts
```

It calculates congestion probability from:

- PRB utilisation pressure
- RSRP degradation
- SINR degradation
- Throughput degradation

This keeps the platform deployable without a separate Python/TensorFlow service, while preserving the same integration contract expected from a real ML serving endpoint. To connect a real ML service later, replace the internal calculation inside `MLService.predictCongestion()` with an HTTP call to `ML_SERVICE_URL + MODEL_ENDPOINT`.

---

## 10. Production Deployment

### Vercel

1. Create a PostgreSQL database on Supabase, Neon, or Vercel Postgres.
2. Add environment variables in the Vercel dashboard.
3. Deploy from GitHub.
4. Run the migration/push command once from a trusted environment:

```bash
npm run db:push
npm run db:seed
```

### Docker

```bash
docker build -t smartconnect .
docker run --env-file .env -p 3000:3000 smartconnect
```

---

## 11. Environment Variables

Use `.env.example` as the base. For real deployment, replace local demo values with production secrets. Never commit `.env`.

---

## 12. Folder Structure

```text
smartconnect/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── icons/
│   └── images/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── (mobile)/
│   │   └── api/
│   ├── components/
│   │   ├── common/
│   │   ├── desktop/
│   │   ├── mobile/
│   │   ├── shared/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   │   ├── auth/
│   │   ├── db/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validations/
│   └── types/
├── docker-compose.yml
├── Dockerfile
├── PROJECT_PITCH.md
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 13. Navigation and User Access

The application now includes clear entry points for all users:

- The landing page explains the project and links to Login and Register.
- The register page lets the user select Subscriber or Operator access.
- Operators and admins access `/dashboard`.
- Subscribers access `/mobile`.
- Logout buttons are visible inside the protected dashboard and subscriber portal.

---

## 14. Extension Plan

For a real operator pilot, the next engineering steps are:

1. Replace simulated KPI seed data with Kafka/REST ingestion from OSS vendors.
2. Add TimescaleDB or ClickHouse for high-volume KPI time-series storage.
3. Connect the ML service to TensorFlow Serving or TorchServe.
4. Add real SMPP, USSD Phase 2, Firebase and Apple APNs connectors.
5. Add MTN MoMo and Orange Money production certification flows.
6. Implement audit-grade exports signed and archived for BEAC compliance.
7. Add row-level security for multi-operator tenancy.

---

## 15. Project Pitch Markdown

A complete explanation file for presentation/defense is included at:

```text
PROJECT_PITCH.md
```

It explains the problem, solution, architecture, business value, modules, and a recommended demonstration script.

---

## 16. Academic Demonstration Notes

This project demonstrates the required concepts from the specification:

- Intelligent network monitoring from radio KPIs.
- Feature engineering over 5-minute KPI windows.
- Congestion scoring and threshold-driven decisions.
- Subscriber trust scoring.
- Network-event-triggered financial services.
- Automatic compensation, insurance and micro-loan logic.
- USSD/mobile inclusion for non-smartphone users.
- Feedback loop for model retraining.
- Enterprise dashboard for network and business teams.
