import type { Request, Response } from "express";
import prisma from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

declare module "bcryptjs";
declare module "jsonwebtoken";

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schemas
const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["BUYER", "SELLER", "ADMIN"]),
  companyName: z.string().optional(),
  phoneNumber: z.string().optional(),
  countryCode: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  companyWebsite: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["BUYER", "SELLER", "ADMIN"]),
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const setAuthCookie = (res: Response, token: string) => {
  res.setHeader(
    "Set-Cookie",
    `auth-token=${token}; HttpOnly; Secure=${
      process.env.NODE_ENV === "production"
    }; SameSite=None; Path=/; Max-Age=${7 * 24 * 60 * 60}`
  );
};

export const signup = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user with transaction to ensure both user and role-specific profile are created
    const result = await prisma.$transaction(async (tx: any) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: validatedData.role,
          companyName: validatedData.companyName,
          phoneNumber: validatedData.phoneNumber,
          country: validatedData.country,
          countryCode: validatedData.countryCode,
          state: validatedData.state,
          address: validatedData.address,
          companyWebsite: validatedData.companyWebsite,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create role-specific profile
      if (validatedData.role === "SELLER") {
        //console.log("seller");
        const data = await tx.seller.create({
          data: {
            userId: user.id,
            businessName: validatedData.companyName,
            businessAddress: validatedData.address,
            websiteLink: validatedData.companyWebsite,
            country: validatedData.country,
          },
        });
      } else {
        await tx.buyer.create({
          data: { userId: user.id },
        });
      }

      // Fetch updated user with relations
      const updatedUser = await tx.user.findUnique({
        where: { id: user.id },
        include: {
          seller: true,
          buyer: true,
        },
      });

      if (!updatedUser) {
        throw new Error("Failed to create user");
      }

      return updatedUser;
    });

    //console.log(result);
    // Generate JWT token
    const token = jwt.sign(
      {
        userId: result.id,
        role: result.role,
        ...(result.role === "SELLER"
          ? { sellerId: result.seller?.id }
          : { buyerId: result.buyer?.id }),
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Set JWT token in cookie
    const data = setAuthCookie(res, token);

    //console.log("req:", req);

    // Return success response
    res.status(201).json({
      message: "User created successfully",
      token, // Still include token in response for client-side storage if needed
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
        companyName: result.companyName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Signup error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        seller: true,
        buyer: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(
      validatedData.password,
      user.password!
    );
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (validatedData.role == "SELLER" && !user.seller) {
      return res.status(401).json({
        error: "User is not a seller",
      });
    } else if (validatedData.role == "BUYER" && !user.buyer) {
      return res.status(401).json({
        error: "User is not a buyer",
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        ...(user.role === "SELLER"
          ? { sellerId: user.seller?.id }
          : { buyerId: user.buyer?.id }),
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Set JWT token in cookie
    // Set JWT token in cookie
    const data = setAuthCookie(res, token);
    // Return success response
    res.json({
      token, // Still include token in response for client-side storage if needed
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.companyName,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  // Clear the auth cookie - make sure options match those used when setting the cookie
  res.clearCookie("auth-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax", // 'lax' is more permissive than 'strict'
    // Don't include domain for localhost
  });

  // For debugging
  console.log("Clearing auth-token cookie");

  res.json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "hello@tejasgk.com",
      to: email,
      subject: "Password Reset",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    if (emailResponse.error) {
      console.log("Email error:", emailResponse.error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process password reset" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password" });
  }
};

export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId; // From auth middleware
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        seller: true,
        buyer: true,
      },
    });
    //console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user without sensitive data
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to get user data" });
  }
};

export const generateOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("OTP:", otp);

    // Store OTP in Redis
    // await storeOTP(email, otp);

    // Send email with OTP via Supabase
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: undefined,
        data: {
          otp,
        },
      },
    });

    if (error) throw error;

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Generate OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Verify OTP via Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // Generate a temporary token for signup completion
    const tempToken = jwt.sign(
      { email, verified: true },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    res.json({
      success: true,
      message: "Email verified successfully",
      token: tempToken,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify email",
    });
  }
};

export const updatePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    //console.log(req.body, req.user);
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password!);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
};
