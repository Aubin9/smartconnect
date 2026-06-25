import { PrismaClient, Role, TransactionStatus, TransactionType, AlertChannel, AlertSeverity, AlertType, CreditType, LoanStatus, NetworkEventType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const regions = [
  { region: 'Douala', lat: 4.0511, lng: 9.7679 },
  { region: 'Yaoundé', lat: 3.8480, lng: 11.5021 },
  { region: 'Bafoussam', lat: 5.4778, lng: 10.4176 },
  { region: 'Bamenda', lat: 5.9631, lng: 10.1591 },
  { region: 'Garoua', lat: 9.3014, lng: 13.3977 }
];

function offset(index: number) {
  return (index % 5) * 0.018 - 0.035;
}

async function main() {
  await prisma.mLFeedback.deleteMany();
  await prisma.mLModel.deleteMany();
  await prisma.insurancePayout.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.airtimeBridge.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.credit.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.trustScoreHistory.deleteMany();
  await prisma.networkQualityEvent.deleteMany();
  await prisma.congestionPrediction.deleteMany();
  await prisma.kpiData.deleteMany();
  await prisma.cellSector.deleteMany();
  await prisma.operatorUser.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@smartconnect.cm',
      name: 'SmartConnect Admin',
      phoneNumber: '237699000001',
      password,
      role: Role.ADMIN,
      operatorUser: { create: { department: 'NOC', roleTitle: 'Platform Administrator' } }
    }
  });

  await prisma.user.create({
    data: {
      email: 'operator@smartconnect.cm',
      name: 'NOC Operator',
      phoneNumber: '237699000002',
      password,
      role: Role.OPERATOR,
      operatorUser: { create: { department: 'Network Operations', roleTitle: 'Network Engineer' } }
    }
  });

  const subscribers = [];
  for (let i = 0; i < 16; i += 1) {
    const trust = 36 + (i * 7) % 59;
    const user = await prisma.user.create({
      data: {
        email: `subscriber${i + 1}@smartconnect.cm`,
        name: ['Acha Marie', 'Nguemo Alain', 'Kamdem Prisca', 'Fongang Jules'][i % 4] + ` ${i + 1}`,
        phoneNumber: `23769012${String(i).padStart(4, '0')}`,
        password,
        role: Role.SUBSCRIBER,
        subscriber: {
          create: {
            msisdn: `23769012${String(i).padStart(4, '0')}`,
            plan: i % 3 === 0 ? 'Smart 3GB Monthly' : i % 3 === 1 ? 'Business 10GB' : 'Youth Data 1.5GB',
            planSpeed: i % 3 === 1 ? 8 : 3,
            accountAge: 4 + i * 3,
            trustScore: trust,
            topUpFrequency: 2 + (i % 5),
            topUpAmount: 1500 + i * 300,
            walletBalance: 1500 + i * 90,
            dataCreditBalance: 300 + i * 25,
            airtimeBalance: 450 + i * 45
          }
        }
      },
      include: { subscriber: true }
    });
    if (user.subscriber) subscribers.push(user.subscriber);
  }

  const cellSectors = [];
  let cellIndex = 1;
  for (const region of regions) {
    for (let j = 0; j < 4; j += 1) {
      const operator = ['MTN', 'Orange', 'Camtel'][j % 3];
      const cell = await prisma.cellSector.create({
        data: {
          cellId: `${operator.substring(0, 2).toUpperCase()}-${region.region.substring(0, 3).toUpperCase()}-${String(cellIndex).padStart(3, '0')}`,
          location: `${region.region} Zone-${j + 1}`,
          region: region.region,
          operator,
          latitude: region.lat + offset(j),
          longitude: region.lng + offset(j + 2)
        }
      });
      cellSectors.push(cell);
      cellIndex += 1;
    }
  }

  const now = new Date();
  for (const [idx, cell] of cellSectors.entries()) {
    for (let step = 0; step < 12; step += 1) {
      const timestamp = new Date(now.getTime() - (55 - step * 5) * 60_000);
      const load = 42 + ((idx * 9 + step * 4) % 55);
      await prisma.kpiData.create({
        data: {
          cellSectorId: cell.id,
          rsrp: -72 - ((idx + step) % 43),
          sinr: 7 + ((idx * 2 + step) % 18),
          prbUtilization: load,
          cqi: 6 + ((idx + step) % 9),
          handoverFailureRate: Number((0.5 + ((idx + step) % 6) * 0.7).toFixed(2)),
          throughput10th: Number((0.35 + (100 - load) / 45).toFixed(2)),
          throughput50th: Number((2.1 + (100 - load) / 18).toFixed(2)),
          throughput90th: Number((6.5 + (100 - load) / 8).toFixed(2)),
          prbChangeRate: Number((Math.sin(step / 2) * 7).toFixed(2)),
          throughputDropVelocity: Number(((load - 45) / 28).toFixed(2)),
          timeOfDay: timestamp.getHours(),
          dayOfWeek: timestamp.getDay(),
          timestamp
        }
      });
    }
    const probability = Math.min(0.96, 0.35 + ((idx * 0.07) % 0.55));
    await prisma.congestionPrediction.create({
      data: {
        cellSectorId: cell.id,
        probability,
        predictedAt: now,
        windowMinutes: [10, 15, 20, 25, 30][idx % 5],
        actualOccurred: probability > 0.78
      }
    });
  }

  for (const [i, subscriber] of subscribers.entries()) {
    await prisma.trustScoreHistory.createMany({
      data: [0, 1, 2, 3].map((month) => ({
        subscriberId: subscriber.id,
        score: Math.max(20, subscriber.trustScore - (3 - month) * 4 + (i % 3)),
        reason: month === 3 ? 'Regular top-ups and stable repayment behaviour' : 'Monthly scoring batch',
        createdAt: new Date(now.getTime() - (90 - month * 30) * 24 * 60 * 60_000)
      }))
    });

    await prisma.insurancePolicy.create({
      data: {
        subscriberId: subscriber.id,
        active: i % 2 === 0,
        premiumAmount: 50,
        dailyPayoutCap: 500,
        dailyCoverageUsed: i % 2 === 0 ? 3.25 : 0
      }
    });

    await prisma.networkQualityEvent.create({
      data: {
        subscriberId: subscriber.id,
        cellSectorId: cellSectors[i % cellSectors.length].id,
        eventType: i % 4 === 0 ? NetworkEventType.QUALITY_DEGRADED : NetworkEventType.CONGESTION_WARNING,
        throughput: i % 4 === 0 ? 0.42 : 4.8,
        latency: 35 + i * 4,
        qoeScore: 88 - i * 3,
        timestamp: new Date(now.getTime() - i * 22 * 60_000)
      }
    });

    await prisma.alert.create({
      data: {
        subscriberId: subscriber.id,
        cellSectorId: cellSectors[i % cellSectors.length].id,
        type: i % 3 === 0 ? AlertType.CREDIT_ADDED : AlertType.CONGESTION_WARNING,
        severity: i % 5 === 0 ? AlertSeverity.CRITICAL : i % 2 === 0 ? AlertSeverity.WARNING : AlertSeverity.INFO,
        title: i % 3 === 0 ? 'Network compensation applied' : 'Congestion predicted in your area',
        message: i % 3 === 0 ? '100 XAF data credit was added after a 30 minute degradation window.' : 'Your area may slow down in 15-20 minutes. Switch to Wi-Fi if possible.',
        sentVia: [AlertChannel.PUSH, AlertChannel.SMS],
        timestamp: new Date(now.getTime() - i * 12 * 60_000)
      }
    });

    await prisma.transaction.create({
      data: {
        subscriberId: subscriber.id,
        type: i % 4 === 0 ? TransactionType.CREDIT : i % 4 === 1 ? TransactionType.TOP_UP : i % 4 === 2 ? TransactionType.INSURANCE_PREMIUM : TransactionType.AIRTIME_BRIDGE,
        amount: i % 4 === 0 ? 100 : i % 4 === 1 ? 1500 : i % 4 === 2 ? 50 : 200,
        description: i % 4 === 0 ? 'Network degradation compensation' : i % 4 === 1 ? 'Mobile Money top-up' : i % 4 === 2 ? 'Daily connectivity insurance premium' : 'Airtime bridge advance',
        status: TransactionStatus.COMPLETED,
        mobileMoneyRef: `SC-${now.getFullYear()}-${String(i + 1000)}`,
        mobileMoneyProvider: i % 2 === 0 ? 'MTN_MOMO' : 'ORANGE_MONEY',
        timestamp: new Date(now.getTime() - i * 18 * 60_000)
      }
    });
  }

  const loanEligible = subscribers.find((subscriber) => subscriber.trustScore > 70 && subscriber.accountAge > 6);
  if (loanEligible) {
    await prisma.loan.create({
      data: {
        subscriberId: loanEligible.id,
        amount: 15000,
        interestRate: 3.5,
        status: LoanStatus.APPROVED,
        trustScoreAtApproval: loanEligible.trustScore,
        approvedAt: now,
        dueDate: new Date(now.getTime() + 28 * 24 * 60 * 60_000)
      }
    });
  }

  await prisma.mLModel.create({
    data: {
      name: 'SmartConnect LSTM Congestion Predictor',
      version: '1.4.2',
      type: 'LSTM',
      accuracy: 0.886,
      aucScore: 0.921,
      precision: 0.842,
      recall: 0.879,
      trainingDate: new Date(now.getTime() - 5 * 24 * 60 * 60_000),
      isActive: true
    }
  });

  console.log('Seed complete');
  console.log('Admin login: admin@smartconnect.cm / Password123!');
  console.log('Operator login: operator@smartconnect.cm / Password123!');
  console.log('Subscriber login: subscriber1@smartconnect.cm / Password123!');
  console.log(`Admin user id: ${admin.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
