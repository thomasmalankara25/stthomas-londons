import { type NextRequest, NextResponse } from "next/server"
import { membershipService } from "@/lib/api/membership"
import type { MembershipRegistrationData } from "@/lib/api/membership"

export async function POST(request: NextRequest) {
  try {
    const body: MembershipRegistrationData = await request.json()

    // Validate required fields
    if (!body.email || !body.primaryMemberName || !body.contactNumber || !body.homeAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the membership registration
    const registration = await membershipService.create(body)

    return NextResponse.json(
      {
        message: "Registration submitted successfully",
        registration,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating membership registration:", error)
    return NextResponse.json({ error: "Failed to submit registration" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const registrations = await membershipService.getAll()
    return NextResponse.json(registrations)
  } catch (error) {
    console.error("Error fetching membership registrations:", error)
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
  }
}
