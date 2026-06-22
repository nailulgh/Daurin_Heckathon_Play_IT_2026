import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the input using Zod
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, role } = parsed.data;

    // Return a mock user object
    const user = {
      id: `mock-id-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
