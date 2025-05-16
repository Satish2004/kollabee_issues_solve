import prisma from "../db";
import { Response } from "express";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInvite = async (req: any, res: Response) => {
  const { emails } = req.body;

  if (!emails) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const { userId } = req.user;

    const allEmail = emails.split(",");
    const allEmailTrimmed = allEmail.map((email: string) => email.trim());
    const allEmailUnique: string[] = [...new Set(allEmailTrimmed as string[])];

    // check if there is an invite already
    const existingInvite = await prisma.invite.findFirst({
      where: {
        email: {
          hasSome: allEmailUnique,
        },
        userId,
      },
    });

    console.log(`existingInvite`, existingInvite);

    if (existingInvite) {
      return res.status(400).json({ message: "Invite already exists" });
    }

    // Check if the email is already registered
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          in: allEmailUnique,
        },
      },
    });
    console.log(" existingUser", existingUser);
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
        email: existingUser.email,
      });
    }

    const exisingInvite = await prisma.invite.findFirst({
      where: {
        userId,
      },
    });

    if (exisingInvite) {
      // push it to the existing invite
      const updatedInvite = await prisma.invite.update({
        where: {
          id: exisingInvite.id,
        },
        data: {
          email: {
            push: allEmailUnique,
          },
        },
      });

      console.log(`updatedInvite`, updatedInvite);
    } else {
      // Save invite to the database
      const invite = await prisma.invite.create({
        data: { email: allEmailUnique, userId },
      });
    }

    // Send email using Resend
    try {
      for (const email of allEmailUnique) {
        await resend.emails.send({
          from: "hello@tejasgk.com",
          to: email,
          subject: "You're Invited!",
          html: `
          <html>
          <body>
            <p>Hello,</p>
            <p>You have been invited to join our platform! We are excited to have you on board. Please click the link below to accept the invitation and get started:</p>
            <p><a href="${process.env.FRONTEND_URL}/" target="_blank">Accept Invitation</a></p>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>Best regards,</p>
            <p>The Team</p>
          </body>
          </html>
        `,
        });
        console.log(`Invitation email successfully sent to ${email}`);
      }
    } catch (emailError) {
      console.error(`Failed to send invitation emails:`, emailError);
      throw new Error("Failed to send invitation emails");
    }

    res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error("Error sending invite:", error);
    res.status(500).json({ message: "Failed to send invite", error });
  }
};

export const getInvites = async (req: any, res: Response) => {
  const {
    pageNo = 1,
    pageSize = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const { userId } = req.user;

  try {
    const invites = await prisma.invite.findMany({
      where: {
        email: {
          has: search,
        },
        userId,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (pageNo - 1) * pageSize,
      take: parseInt(pageSize),
    });

    const totalCount = await prisma.invite.count({
      where: {
        email: {
          has: search,
        },
      },
    });

    res.status(200).json({ invites, totalCount });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch invites", error });
  }
};
