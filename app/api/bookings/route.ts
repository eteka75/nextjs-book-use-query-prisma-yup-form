import { BookingSchema } from "@/lib/schemas/validationSchemas";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, startDate, endDate } = data;

  console.log(data);
  try {
    await BookingSchema.validate(
      { name, startDate, endDate },
      { abortEarly: false }
    );

    // Créer la réservation
    const booking = await prisma.booking.create({
      data: {
        name: name as string,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return new Response(JSON.stringify(booking), { status: 200 });
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      console.error("Validation errors:", error.errors);
      return new Response(JSON.stringify({ errors: error.errors }), {
        status: 400,
      });
    }

    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Failed to create booking" }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany();
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.error();
  }
}
