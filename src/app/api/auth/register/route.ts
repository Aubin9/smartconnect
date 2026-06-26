import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

// Force dynamic rendering to avoid build-time Prisma execution
export const dynamic = "force-dynamic";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(9),
  password: z.string().min(8),
  role: z.enum(["SUBSCRIBER", "OPERATOR"]).default("SUBSCRIBER"),
});

export async function POST(req: Request) {
  try {
    const body = registerSchema.parse(await req.json());
    const password = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phoneNumber: body.phoneNumber,
        password,
        role: body.role,
        ...(body.role === "SUBSCRIBER"
          ? {
              subscriber: {
                create: {
                  msisdn: body.phoneNumber,
                  plan: "Smart 3GB Monthly",
                  planSpeed: 3,
                  accountAge: 0,
                  trustScore: 40,
                  walletBalance: 0,
                  dataCreditBalance: 0,
                  airtimeBalance: 0,
                },
              },
            }
          : {
              operatorUser: {
                create: {
                  department: "General",
                  roleTitle: "Operator Analyst",
                },
              },
            }),
      },
      select: { id: true, email: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 400 },
    );
  }
}
