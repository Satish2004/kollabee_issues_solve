import { Request, Response } from "express";
import prisma from "../db";
import { CategoryEnum } from "@prisma/client";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;

    // Validate if categoryName is a valid CategoryEnum
    if (!Object.values(CategoryEnum).includes(categoryName)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category name",
      });
    }

    const category = await prisma.category.create({
      data: {
        categoryName,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    if (!Object.values(CategoryEnum).includes(categoryName)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category name",
      });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { categoryName },
    });

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};
