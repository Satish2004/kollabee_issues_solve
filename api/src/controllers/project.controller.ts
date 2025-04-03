import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const prisma = new PrismaClient();

export const createProject = async (req: any, res: Response) => {
  try {
    const { milestones, ...projectData } = req.body;
    console.log("req.user ", req.user);
    let { projectTimeline } = projectData;
    if (projectTimeline) {
      projectTimeline = projectTimeline.map((date: any) => new Date(date));
    }

    /*

model Milestone {
  id          String   @id @default(uuid())
  name        String
  description String
  paymentPercentage Float
  dueDate     DateTime
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
    */
    const newMileStones = milestones.map((milestone: any) => ({
      name: milestone.name,
      description: milestone.description,
      paymentPercentage: parseFloat(milestone.paymentPercentage),
      dueDate: milestone.dueDate[0] ? new Date(milestone.dueDate[0]) : null,
    }));

    console.log("req.body ", projectTimeline);

    const project = await prisma.project.create({
      data: {
        ...projectData,
        projectTimeline: projectTimeline,
        milestones: {
          create: newMileStones || [], // Handle empty milestones gracefully
        },
        ownerId: req.user.buyerId, // Set the ownerId to the authenticated user's buyerId
      },
      include: { milestones: true }, // Include milestones in the response
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const getProjects = async (req: any, res: Response) => {
  try {
    const projects = await prisma.project.findMany();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

export const updateProject = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { milestones, ...projectData } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project || project.ownerId !== req.user.buyerId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        milestones: {
          deleteMany: {}, // Clear existing milestones
          create: milestones || [], // Handle empty milestones gracefully
        },
      },
      include: { milestones: true }, // Include milestones in the response
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project || project.ownerId !== req.user.buyerId) {
      return res.status(403).json({ error: "Access denied" });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
};
