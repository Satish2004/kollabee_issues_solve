import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createProject = async (req: Request, res: Response) => {
  try {
    const { milestones, ...projectData } = req.body;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        milestones: {
          create: milestones, // Create related milestones
        },
      },
      include: { milestones: true }, // Include milestones in the response
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project", details: error });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects", details: error });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: "Failed to fetch project", details: error });
  }
};

export const updateProject = async (req: Request, res: Response) => {
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
          create: milestones, // Add new milestones
        },
      },
      include: { milestones: true }, // Include milestones in the response
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project", details: error });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
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
    res.status(500).json({ error: "Failed to delete project", details: error });
  }
};
