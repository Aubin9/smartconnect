import { redirect } from "next/navigation";
import { auth } from "./config";

export async function requireSession(roles?: string[]) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (roles?.length && !roles.includes(session.user.role)) redirect("/mobile");
  return session;
}
