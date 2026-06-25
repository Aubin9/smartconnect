// import NextAuth from 'next-auth';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      phoneNumber: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role?: string;
    phoneNumber?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    phoneNumber?: string;
  }
}
