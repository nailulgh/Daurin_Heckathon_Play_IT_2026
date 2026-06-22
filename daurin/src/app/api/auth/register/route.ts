import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the input using Zod
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, password, role, lat, lng, wasteTypesHandled } = parsed.data;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: { formErrors: ["Email is already registered"] } },
        { status: 400 }
      );
    }

    // Hash the password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); 

    // Create the user
    // The wasteTypesHandled field only applies to PENGEPUL according to the schema.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        lat,
        lng,
        wasteTypesHandled: role === "PENGEPUL" && wasteTypesHandled ? wasteTypesHandled : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
