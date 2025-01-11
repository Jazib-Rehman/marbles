import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "../../../../../lib/mongoose";
import Admin from "../../../../../models/Admin";

const JWT_SECRET = "123qwsaqw2frWE"; // Replace with a strong, secure key

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      JWT_SECRET,
      {
        expiresIn: "1d", // Token expires in 1 day
      }
    );

    // Set token in an HTTP-only cookie
    const response = NextResponse.json(
      { message: "Login successful", adminId: admin._id,token },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true, // Secure cookie, inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      maxAge: 24 * 60 * 60, // 1 day in seconds
      sameSite: "strict", // CSRF protection
      path: "/", // Accessible to all routes
    });

    return response;
  } catch (error) {
    console.error("Error during admin login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
