import { PrismaClient, CategoryEnum, Seller } from "@prisma/client";
import { Response, Request } from "express";

const prisma = new PrismaClient();

export const createProject = async (req: any, res: Response) => {
  try {
    const { milestones, ...projectData } = req.body;
    console.log("req.user ", req.user);
    let { projectTimeline } = projectData;
    if (projectTimeline) {
      projectTimeline = projectTimeline.map((date: any) => new Date(date));
    }

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

export const suggestedSellers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Fetch the project details by ID
    const project = await prisma.project.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Fetch sellers that match the project's requirements
    const sellers = await prisma.seller.findMany({
      where: {
        businessCategories: {
          has: getCategoryFromProjectCategory(project.category),
        },
        country: project.owner?.location || undefined,
      },
      include: {
        products: true,
        user: true,
      },
    });

    // Map sellers to the required format
    const sellerList = sellers.map((seller) => ({
      id: seller.id,
      name: seller.businessName || seller.user?.name || "Unknown Seller",
      logo:
        seller.user?.imageUrl ??
        "https://res.cloudinary.com/dyumydxmc/image/upload/v1743683115/Untitled_design_8_lnlkcc.png",
      rating: seller.rating || 0,
      reviews: seller.products?.length || 0,
      description:
        seller.products?.[0]?.description || "No description available",
      productType: seller.products?.[0]?.name || "No product type available",
      priceRange: `$${seller.products?.[0]?.price || 0} - ${
        seller.products?.[0]?.wholesalePrice || 0
      }`,
      minOrder: `Min. order: ${seller.minimumOrderQuantity || "N/A"}`,
      location: seller.businessAddress || "Unknown",
      age:
        new Date().getFullYear() -
        (seller.yearEstablished || new Date().getFullYear()),
      country: seller.user?.country || "Unknown",
      verified: true,
      tags: seller.businessCategories || [],
    }));

    res.status(200).json(sellerList);
  } catch (error) {
    console.error("Error fetching suggested sellers:", error);
    res.status(500).json({ error: "Failed to fetch suggested sellers" });
  }
};

function getCategoryFromProjectCategory(projectCategory: string): CategoryEnum {
  const categoryMap: Record<string, CategoryEnum> = {
    beauty: "BEAUTY_COSMETICS",
    cosmetics: "BEAUTY_COSMETICS",
    fashion: "FASHION_APPAREL_ACCESSORIES",
    apparel: "FASHION_APPAREL_ACCESSORIES",
    food: "FOOD_BEVERAGES",
    beverage: "FOOD_BEVERAGES",
    health: "HEALTH_WELLNESS",
    wellness: "HEALTH_WELLNESS",
    home: "HOME_CLEANING_ESSENTIALS",
    cleaning: "HOME_CLEANING_ESSENTIALS",
    herbal: "HERBAL_NATURAL_PRODUCTS",
    natural: "HERBAL_NATURAL_PRODUCTS",
  };

  for (const [key, value] of Object.entries(categoryMap)) {
    if (projectCategory.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  return "OTHER";
}

function getSellerDescription(seller: Seller, project: any): string {
  const descriptions = [
    `Specialized in ${project.productType} with ${project.materialPreferences} materials`,
    `Expert manufacturer of ${project.category} products with focus on ${project.targetBenefit}`,
    `Leading supplier of ${project.productType} with custom ${project.packagingType} options`,
    `Premium ${project.category} manufacturer with ${project.certificationsRequired} certification`,
    `Experienced in producing ${project.texturePreferences} texture ${project.productType}`,
  ];

  return (
    seller.comments ||
    descriptions[Math.floor(Math.random() * descriptions.length)]
  );
}

function getProductTypeDescription(seller: Seller, project: any): string {
  return `Most popular Supplier in ${project.productType}`;
}

function getPriceRange(): string {
  const min = Math.floor(Math.random() * 500) + 100;
  const max = min + Math.floor(Math.random() * 1000) + 200;
  return `$${min.toFixed(2)}-${max.toFixed(2)}`;
}

function getRelevantTags(seller: Seller, project: any): string[] {
  const allPossibleTags = [
    project.category,
    project.productType,
    project.materialPreferences,
    project.packagingType,
    project.targetBenefit,
    "Manufacturing",
    "Custom",
    "Wholesale",
    "Premium",
    "Eco-friendly",
  ];

  const validTags = allPossibleTags.filter((tag) => tag);
  const numTags = Math.floor(Math.random() * 3) + 3;

  const selectedTags: string[] = [];
  for (let i = 0; i < numTags && i < validTags.length; i++) {
    const randomIndex = Math.floor(Math.random() * validTags.length);
    if (!selectedTags.includes(validTags[randomIndex])) {
      selectedTags.push(validTags[randomIndex]);
    }
  }

  return selectedTags;
}
