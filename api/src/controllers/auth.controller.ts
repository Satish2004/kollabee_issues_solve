import type { Request, Response } from "express";
import prisma from "../db";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { OAuth2Client } from "google-auth-library";
import { googleClient } from "../config/google.config";
import { countries } from "../utils/countries";

declare module "bcryptjs";
declare module "jsonwebtoken";

const resend = new Resend(process.env.RESEND_API_KEY);

const commonSignupFields = {
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  countryCode: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  role: z.enum(["BUYER", "SELLER", "ADMIN"]),
  roleInCompany: z.string().optional(),
};

// Seller-specific fields
const sellerFields = {
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  businessDescription: z.string().optional(),
  businessAddress: z.string().optional(),
  websiteLink: z.string().optional(),
  businessTypes: z.array(z.string()).optional(),
  businessCategories: z.array(z.string()).optional(),
  selectedObjectives: z.array(z.string()).optional(),
  selectedChallenges: z.array(z.string()).optional(),
  selectedMetrics: z.array(z.string()).optional(),
  agreement1: z.boolean().optional(),
  agreement2: z.boolean().optional(),
};

// Buyer-specific fields
const buyerFields = {
  businessName: z.string().optional(),
  businessDescription: z.string().optional(),
  businessType: z.string().optional(),
  otherBusinessType: z.string().optional(),
  lookingFor: z.array(z.string()).optional(),
};

const buyerSchema = z.object({
  businessName: z.string(),
  businessDescription: z.string(),
  businessType: z.string(),
  otherBusinessType: z.string().optional(),
  lookingFor: z.array(z.string()),
});

const signupSchema = z.object({
  ...commonSignupFields,
  ...sellerFields,
  ...buyerFields,
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

    // Combine first and last name
    const fullName = `${validatedData.firstName} ${validatedData.lastName}`;
    const address = validatedData.businessAddress || "";

    const zipCodeMatch = address.match(/\b\d{6}\b/);
    const zipCode = zipCodeMatch ? zipCodeMatch[0] : undefined;

    // 2. Match State from known list
    const states = [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Delhi",
      "Jammu and Kashmir",
      "Ladakh",
    ];

    const matchedCountry = countries.find((country) =>
      address.toLowerCase().includes(country.name.toLowerCase())
    );

    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: fullName,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          role: validatedData.role,
          companyName: validatedData.businessName || "",
          phoneNumber: validatedData.phone || "",
          country: matchedCountry?.name ?? (validatedData.country || ""),
          countryCode:
            matchedCountry?.code ?? (validatedData.countryCode || ""),
          state: zipCode ?? (validatedData.state || ""),
          address: validatedData.businessAddress || "",
          companyWebsite: validatedData.websiteLink || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create role-specific profile
      if (validatedData.role === "SELLER") {
        // Create seller profile with all the seller-specific fields
        await tx.seller.create({
          data: {
            userId: user.id,
            businessName: validatedData.businessName || "",
            businessDescription: validatedData.businessDescription || "",
            businessAddress: validatedData.businessAddress || "",
            websiteLink: validatedData.websiteLink || "",
            country: validatedData.country || "",
            roleInCompany: validatedData.roleInCompany || "",
            businessTypes: validatedData.businessTypes || [],
            businessCategories: validatedData.businessCategories || [],
            objectives: validatedData.selectedObjectives || [],
            challenges: validatedData.selectedChallenges || [],
            metrics: validatedData.selectedMetrics || [],
            profileCompletion: [1, 2],
            agrrement1: validatedData.agreement1 || false,
            agrrement2: validatedData.agreement2 || false,
          },
        });
      } else if (validatedData.role === "BUYER") {
        console.log("is here : ", validatedData);
        // Create buyer profile with all the buyer-specific fields
        await tx.buyer.create({
          data: {
            userId: user.id,
            businessName: validatedData.businessName || "",
            businessDescription: validatedData.businessDescription || "",
            businessType: validatedData.businessType || "",
            otherBusinessType: validatedData.otherBusinessType || "",
            lookingFor: validatedData.lookingFor || [],
          },
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
    setAuthCookie(res, token);

    // Return success response
    res.status(201).json({
      message: "User created successfully",
      token, // Still include token in response for client-side storage if needed
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
        companyName: result.companyName || result.businessName,
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

export const buyerSingnupGoogle = async (req: any, res: Response) => {
  try {
    const {
      companyName,
      businessDescription,
      businessType,
      otherBusinessType,
      lookingFor,
      roleInCompany,
      token,
    } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const validatedData = buyerSchema.parse(req.body);

    console.log("decoded", decoded);
    if (!decoded.userId) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const existingUser = await prisma.user.findFirst({
      where: { id: decoded.userId },
      include: {
        buyer: true,
      },
    });

    if (!existingUser) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!existingUser.buyer) {
      await prisma.buyer.create({
        data: {
          businessName: companyName,
          businessDescription: businessDescription,
          businessType: businessType,
          otherBusinessType: otherBusinessType,
          lookingFor: lookingFor,
          userId: decoded.userId,
        },
      });
    } else {
      await prisma.buyer.update({
        where: {
          userId: decoded.userId,
        },
        data: {
          businessName: companyName,
          businessDescription: businessDescription,
          businessType: businessType,
          otherBusinessType: otherBusinessType,
          lookingFor: lookingFor,
          userId: decoded.userId,
        },
      });
    }

    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Buyer created successfully",
      token, // Still include token in response for client-side storage if needed
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    console.log("error", error);
    return res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findFirst({
      where: { email: { contains: validatedData.email, mode: "insensitive" } },
      include: {
        seller: true,
        buyer: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.provider === "GOOGLE") {
      return res.status(401).json({
        error: "User registered with Google. Please login with Google.",
      });
    }

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

    if (validatedData.role === "ADMIN" && user.role != "ADMIN") {
      return res.status(401).json({
        error: "User is not an admin",
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
          : user.role === "ADMIN"
            ? { adminId: user.id }
            : { buyerId: user.buyer?.id }),
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

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
    console.log("Reset link:", resetLink);

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
      type: "signup",
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

// Google OAuth functions
export const googleAuth = (req: Request, res: Response) => {
  try {
    // Get the role from query parameters
    const role = (req.query.role as string) || "BUYER";

    // Validate role
    if (!["BUYER", "SELLER"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // Store role in state parameter
    const state = Buffer.from(JSON.stringify({ role })).toString("base64");

    // Generate Google OAuth URL
    const authUrl = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      state,
    });

    console.log("Google Auth URL:", authUrl);

    // Redirect to Google OAuth
    res.redirect(authUrl);
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: "Failed to initiate Google authentication" });
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code is required" });
    }

    // Parse state to get role
    let role = "BUYER";
    try {
      const stateData = JSON.parse(
        Buffer.from(state as string, "base64").toString()
      );
      console.log("role", stateData);
      role = stateData.role || "BUYER";
    } catch (error) {
      console.error("Error parsing state:", error);
    }

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code as string);

    // Set credentials
    googleClient.setCredentials(tokens);

    // Get user info
    const oauth2 = new OAuth2Client();
    oauth2.setCredentials(tokens);

    const userInfoResponse = await oauth2.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });

    const userInfo = userInfoResponse.data as {
      email: string;
      name: string;
      picture?: string;
    };

    console.log("User Info:", userInfo);

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: userInfo.email },
      include: {
        seller: true,
        buyer: true,
      },
    });

    if (!user) {
      // Create new user
      user = await prisma.$transaction(async (tx: any) => {
        // Create user
        const newUser = await tx.user.create({
          data: {
            email: userInfo.email,
            name: userInfo.name,
            role: role,
            provider: "GOOGLE",
            imageUrl: userInfo.picture,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Create role-specific profile
        if (role === "SELLER") {
          await tx.seller.create({
            data: { userId: newUser.id },
          });
        } else if (role === "BUYER") {
          await tx.buyer.create({
            data: { userId: newUser.id },
          });
        } else {
          res.redirect(
            `${
              process.env.FRONTEND_URL
            }/auth/callback?error=${"You can not create an admin account"}`
          );
        }

        // Fetch updated user with relations
        return await tx.user.findUnique({
          where: { id: newUser.id },
          include: {
            seller: true,
            buyer: true,
            admin: true,
          },
        });
      });

      if (user) {
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

        if (role === "BUYER") {
          return res.redirect(
            `${process.env.FRONTEND_URL}/google?token=${token}&role=${role}&code=${code}&new=true`
          );
        }
      }
    } else {
      // Check if user has the requested role

      if (user.role !== role) {
        // If the user exists but has a different role, update the role
        console.log("redirecting to error page");
        return res.redirect(
          `${process.env.FRONTEND_URL}/google?error=${"user is not a a"}${role}`
        );
      }

      // Update user's last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    }

    // Generate JWT token
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

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
    setAuthCookie(res, token);
    res.redirect(
      `${process.env.FRONTEND_URL}/google?token=${token}&role=${role}&code=${code}`
    );

    return;
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?error=${error}`);
  }
};
