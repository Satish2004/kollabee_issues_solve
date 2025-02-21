import { Request, Response } from 'express';
import prisma from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['BUYER', 'SELLER']),
  companyName: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  address: z.string().optional(),
  companyWebsite: z.string().url().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const signup = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = signupSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user with transaction to ensure both user and role-specific profile are created
    const result = await prisma.$transaction(async (tx:any) => {
      // Create user
      let user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: validatedData.role,
          companyName: validatedData.companyName,
          phoneNumber: validatedData.phoneNumber,
          country: validatedData.country,
          state: validatedData.state,
          address: validatedData.address,
          companyWebsite: validatedData.companyWebsite,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      // Create role-specific profile
      if (validatedData.role === 'SELLER') {
        await tx.seller.create({
          data: {
            userId: user.id,
            businessName: validatedData.companyName,
            businessAddress: validatedData.address,
            websiteLink: validatedData.companyWebsite,
          }
        });
      } else {
        await tx.buyer.create({
          data: { userId: user.id }
        });
      }

      // Fetch updated user with relations
      const updatedUser = await tx.user.findUnique({
        where: { id: user.id },
        include: {
          seller: true,
          buyer: true
        }
      });

      if (!updatedUser) {
        throw new Error('Failed to create user');
      }

      return updatedUser;
    });
    console.log(result);
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: result.id,
        role: result.role,
        ...(result.role === 'SELLER' ? { sellerId: result.seller?.id } : { buyerId: result.buyer?.id })
      }, 
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
        companyName: result.companyName,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error creating user' });
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
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(validatedData.password, user.password!);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        role: user.role,
        ...(user.role === 'SELLER' ? { sellerId: user.seller?.id } : { buyerId: user.buyer?.id })
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Return success response
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.companyName,
        lastLogin: user.lastLogin,
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // Here you would typically send an email with the reset link
    // For now, just return the token
    res.json({ message: 'Password reset email sent', resetToken });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process password reset' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId; // From auth middleware
console.log(userId);
    const user = await prisma.user.findUnique({
      where: { id: "b0c3a8b4-4b86-4f53-94a2-78bc5901601b" },
      include: {
        seller: true,
        buyer: true,
      }
    });
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user without sensitive data
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
};

export const generateOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Generate OTP via Supabase
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${process.env.FRONTEND_URL}/auth/verify`
      }
    });

    if (error) {
      console.error('Supabase OTP error:', error);
      throw error;
    }

    res.json({ 
      success: true, 
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Generate OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send verification email' 
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
      type: 'email'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Generate a temporary token for signup completion
    const tempToken = jwt.sign(
      { email, verified: true },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    res.json({
      success: true,
      message: 'Email verified successfully',
      token: tempToken
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify email'
    });
  }
}; 