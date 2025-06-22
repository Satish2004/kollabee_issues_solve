import { PrismaClient, type CategoryEnum, type Seller } from "@prisma/client";
import type { Response, Request } from "express";
const { Resend } = require("resend");

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const createProject = async (req: any, res: Response) => {
  try {
    const { milestones, ...projectData } = req.body;

    // Process timeline dates based on project type
    const projectTimeline = [];
    let {
      projectTimelineFrom,
      projectTimelineTo,
      receiveDate,
      launchDate,
      serviceStartDate,
      serviceEndDate,
      ...newProjectData
    } = projectData;

    // Set timeline based on project type
    if (projectData.selectedServices?.includes("services-brand-support")) {
      if (serviceStartDate) projectTimeline.push(new Date(serviceStartDate));
      if (serviceEndDate) projectTimeline.push(new Date(serviceEndDate));

      // Set legacy fields for compatibility
      projectTimelineFrom = serviceStartDate;
      projectTimelineTo = serviceEndDate;
    } else {
      if (receiveDate) projectTimeline.push(new Date(receiveDate));
      if (launchDate) projectTimeline.push(new Date(launchDate));

      // Set legacy fields for compatibility
      projectTimelineFrom = receiveDate;
      projectTimelineTo = launchDate || receiveDate;
    }

    // // Process milestones
    // const newMileStones =
    //   milestones?.map((milestone: any) => ({
    //     name: milestone.name || "Milestone",
    //     description: milestone.description || "Description",
    //     paymentPercentage: Number.parseFloat(
    //       milestone.paymentPercentage || "100"
    //     ),
    //     dueDate: milestone.dueDate ? new Date(milestone.dueDate) : new Date(),
    //   })) || [];

    // // If no milestones provided, create a default one
    // if (newMileStones.length === 0 && projectTimeline.length > 0) {
    //   newMileStones.push({
    //     name: "Project Completion",
    //     description: "Full payment upon completion",
    //     paymentPercentage: 100,
    //     dueDate: projectTimeline[projectTimeline.length - 1] || new Date(),
    //   });
    // }

    // Set business name from project title if available
    if (projectData.projectTitle && !projectData.businessName) {
      newProjectData.businessName = projectData.projectTitle;
    }

    // Set category and product type based on project type
    if (projectData.selectedServices?.includes("custom-manufacturing")) {
      newProjectData.category =
        projectData.productCategory.join(",") || "OTHER";
      newProjectData.productType =
        projectData.productCategory.join(",") || "OTHER";
    } else if (projectData.selectedServices?.includes("packaging-only")) {
      newProjectData.category = "PACKAGING";
      newProjectData.productType =
        projectData.packagingCategory.join(",") || "PACKAGING";
    } else if (
      projectData.selectedServices?.includes("services-brand-support")
    ) {
      newProjectData.category = "SERVICES";
      newProjectData.productType = "SERVICES";
    }

    // Set certifications string for backward compatibility
    if (
      projectData.certifications &&
      Array.isArray(projectData.certifications)
    ) {
      newProjectData.certificationsRequired =
        projectData.certifications.join(", ");
    }

    // Set other required fields with defaults if needed
    newProjectData.formulationType =
      projectData.hasDesignOrFormula || projectData.formulationType || "N/A";
    newProjectData.targetBenefit =
      projectData.customizationLevel || projectData.targetBenefit || "N/A";
    newProjectData.packagingType =
      projectData.needsPackaging || projectData.packagingType || "N/A";
    newProjectData.materialPreferences =
      projectData.ecoFriendly || projectData.materialPreferences || "N/A";
    newProjectData.sampleRequirements =
      projectData.needsSample || projectData.sampleRequirements || "no";
    newProjectData.minimumOrderQuantity =
      projectData.quantity?.toString() ||
      projectData.minimumOrderQuantity ||
      "100";

    // Create the project with all fields
    const project = await prisma.project.create({
      data: {
        ...newProjectData,
        projectTimeline,

        // Store dates properly
        receiveDate: receiveDate ? new Date(receiveDate) : null,
        launchDate: launchDate ? new Date(launchDate) : null,
        serviceStartDate: serviceStartDate ? new Date(serviceStartDate) : null,
        serviceEndDate: serviceEndDate ? new Date(serviceEndDate) : null,

        // Store reference files as JSON
        referenceFiles: projectData.referenceFiles
          ? JSON.stringify(projectData.referenceFiles)
          : null,

        // Store certifications as array
        certifications: projectData.certifications || [],

        // Set owner
        ownerId: req.user.buyerId,
      },
      include: { milestones: true },
    });

    // console.log("Project created:", project);

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      error: "Failed to create project",
      details: (error as Error)?.message || "Unknown error",
    });
  }
};

export const updateProject = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { milestones, ...projectData } = req.body;

    // Check if project exists and user has permission
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.ownerId !== req.user.buyerId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Process timeline dates based on project type
    const projectTimeline = [];
    let {
      projectTimelineFrom,
      projectTimelineTo,
      receiveDate,
      launchDate,
      serviceStartDate,
      serviceEndDate,
      ...newProjectData
    } = projectData;

    // Set timeline based on project type
    if (projectData.selectedServices?.includes("services-brand-support")) {
      if (serviceStartDate) projectTimeline.push(new Date(serviceStartDate));
      if (serviceEndDate) projectTimeline.push(new Date(serviceEndDate));

      // Set legacy fields for compatibility
      projectTimelineFrom = serviceStartDate;
      projectTimelineTo = serviceEndDate;
    } else {
      if (receiveDate) projectTimeline.push(new Date(receiveDate));
      if (launchDate) projectTimeline.push(new Date(launchDate));

      // Set legacy fields for compatibility
      projectTimelineFrom = receiveDate;
      projectTimelineTo = launchDate || receiveDate;
    }

    // Process milestones
    const newMileStones =
      milestones?.map((milestone: any) => ({
        name: milestone.name || "Milestone",
        description: milestone.description || "Description",
        paymentPercentage: Number.parseFloat(
          milestone.paymentPercentage || "100"
        ),
        dueDate: milestone.dueDate ? new Date(milestone.dueDate) : new Date(),
      })) || [];

    // If no milestones provided, create a default one
    if (newMileStones.length === 0 && projectTimeline.length > 0) {
      newMileStones.push({
        name: "Project Completion",
        description: "Full payment upon completion",
        paymentPercentage: 100,
        dueDate: projectTimeline[projectTimeline.length - 1] || new Date(),
      });
    }

    // Set business name from project title if available
    if (projectData.projectTitle && !projectData.businessName) {
      newProjectData.businessName = projectData.projectTitle;
    }

    // Set category and product type based on project type
    if (projectData.selectedServices?.includes("custom-manufacturing")) {
      newProjectData.category =
        projectData.productCategory.join(",") || "OTHER";
      newProjectData.productType =
        projectData.productCategory.join(",") || "OTHER";
    } else if (projectData.selectedServices?.includes("packaging-only")) {
      newProjectData.category = "PACKAGING";
      newProjectData.productType = projectData.packagingCategory || "PACKAGING";
    } else if (
      projectData.selectedServices?.includes("services-brand-support")
    ) {
      newProjectData.category = "SERVICES";
      newProjectData.productType = "SERVICES";
    }

    // Set certifications string for backward compatibility
    if (
      projectData.certifications &&
      Array.isArray(projectData.certifications)
    ) {
      newProjectData.certificationsRequired =
        projectData.certifications.join(", ");
    }

    // Set other required fields with defaults if needed
    newProjectData.formulationType =
      projectData.hasDesignOrFormula || projectData.formulationType || "N/A";
    newProjectData.targetBenefit =
      projectData.customizationLevel || projectData.targetBenefit || "N/A";
    newProjectData.packagingType =
      projectData.needsPackaging || projectData.packagingType || "N/A";
    newProjectData.materialPreferences =
      projectData.ecoFriendly || projectData.materialPreferences || "N/A";
    newProjectData.sampleRequirements =
      projectData.needsSample || projectData.sampleRequirements || "no";
    newProjectData.minimumOrderQuantity =
      projectData.quantity?.toString() ||
      projectData.minimumOrderQuantity ||
      "100";

    // Update the project with all fields
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...newProjectData,
        projectTimeline,

        // Store dates properly
        receiveDate: receiveDate ? new Date(receiveDate) : null,
        launchDate: launchDate ? new Date(launchDate) : null,
        serviceStartDate: serviceStartDate ? new Date(serviceStartDate) : null,
        serviceEndDate: serviceEndDate ? new Date(serviceEndDate) : null,

        // Store reference files as JSON
        referenceFiles: projectData.referenceFiles
          ? JSON.stringify(projectData.referenceFiles)
          : null,

        // Store certifications as array
        certifications: projectData.certifications || [],

        // Update milestones
        milestones: {
          deleteMany: {}, // Clear existing milestones
          create: newMileStones,
        },
      },
      include: { milestones: true },
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      error: "Failed to update project",
      details: (error as Error)?.message || "Unknown error",
    });
  }
};

export const getProjects = async (req: any, res: Response) => {
  try {
    const { userId, buyerId } = req.user;
    if (!userId || !buyerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch all projects for the user
    const projectsData = await prisma.project.findMany({
      where: {
        owner: {
          id: buyerId,
        },
      },
      include: {
        requestedSeller: {
          where: {
            status: "APPROVED",
          },
        },
        milestones: true,
      },
    });

    // console.log("last project : ", projects[projects.length - 1]);
    res.status(200).json(projectsData);
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
      include: {
        milestones: true,
        owner: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                imageUrl: true,
                country: true,
              },
            },
          },
        },
      },
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
    const {
      search,
      minRating,
      maxRating,
      country,
      supplierTypes,
      sortBy,
      sortOrder,
      minAge,
      maxAge,
      priceRange,
    } = req.query;

    console.log("Query params:", req.query);

    // Fetch the project details by ID
    const project = await prisma.project.findUnique({
      where: { id },
      include: { owner: true },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    const where: any = {
      businessCategories: {
        has: getCategoryFromProjectCategory(project.category),
      },
    };

    console.log("Where clause:", where);
    if (country && country !== "all") {
      where.country = country;
    } else if (project.owner?.location) {
      where.country = project.owner.location;
    }

    // Add rating filter
    if (minRating) {
      where.rating = {
        ...where.rating,
        gte: Number.parseFloat(minRating as string),
      };
    }

    if (maxRating) {
      where.rating = {
        ...where.rating,
        lte: Number.parseFloat(maxRating as string),
      };
    }

    // Add supplier type filter
    if (supplierTypes) {
      const types = (supplierTypes as string).split(",");
      where.businessTypes = {
        hasSome: types,
      };
    }

    // Add age filter (yearEstablished)
    const currentYear = new Date().getFullYear();
    if (minAge) {
      where.yearEstablished = {
        ...where.yearEstablished,
        lte: currentYear - Number.parseInt(minAge as string),
      };
    }

    if (maxAge) {
      where.yearEstablished = {
        ...where.yearEstablished,
        gte: currentYear - Number.parseInt(maxAge as string),
      };
    }

    console.log("Where clause:", where);

    // Build the orderBy clause for sorting
    const orderBy: any = {};
    if (sortBy) {
      const order = sortOrder === "desc" ? "desc" : "asc";

      switch (sortBy) {
        case "rating":
          orderBy.rating = order;
          break;
        case "age":
          orderBy.yearEstablished = order === "asc" ? "desc" : "asc"; // Reverse for age
          break;
        case "name":
          orderBy.businessName = order;
          break;
        default:
          orderBy.rating = "desc"; // Default sort
      }
    } else {
      orderBy.rating = "desc"; // Default sort
    }

    // Fetch sellers that match the criteria
    const sellers = await prisma.seller.findMany({
      where,
      orderBy,
      include: {
        products: true,
        user: true,
      },
    });

    console.log(`Found ${sellers.length} sellers before filtering`);

    // Apply search filter (done after DB query for flexibility)
    let filteredSellers = sellers;
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredSellers = sellers.filter(
        (seller) =>
          seller.businessName?.toLowerCase().includes(searchTerm) ||
          seller.user?.name?.toLowerCase().includes(searchTerm) ||
          seller.businessAddress?.toLowerCase().includes(searchTerm) ||
          seller.products?.some(
            (p) =>
              p.name.toLowerCase().includes(searchTerm) ||
              p.description.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Apply price range filter if provided
    if (priceRange) {
      const [min, max] = (priceRange as string).split("-").map(Number);
      filteredSellers = filteredSellers.filter((seller) => {
        // Check if any product's price falls within the range
        return seller.products?.some(
          (p) =>
            (p.price >= min && p.price <= max) ||
            (p.wholesalePrice >= min && p.wholesalePrice <= max)
        );
      });
    }

    console.log(`Found ${filteredSellers.length} sellers after filtering`);

    // Map sellers to the required format
    const sellerList = filteredSellers.map((seller) => ({
      id: seller.id,
      name: seller.businessName || seller.user?.name || "Unknown Seller",
      logo:
        seller.user?.imageUrl ??
        "https://res.cloudinary.com/dyumydxmc/image/upload/v1743683115/Untitled_design_8_lnlkcc.png",
      rating: seller.rating || 0,
      reviews: seller.products?.length || 0,
      description: getSellerDescription(seller, project),
      productType: getProductTypeDescription(seller, project),
      priceRange: getPriceRange(),
      minOrder: `Min. order: ${seller.minimumOrderQuantity || "N/A"}`,
      location: seller.businessAddress || "Unknown",
      age:
        new Date().getFullYear() -
        (seller.yearEstablished || new Date().getFullYear()),
      country: seller.country || seller.user?.country || "Unknown",
      verified: true,
      tags: getRelevantTags(seller, project),
    }));

    console.log(`Returning ${sellerList.length} formatted sellers`);

    return res.status(200).json({
      sellers,
      project,
      where
    });
    
  } catch (error) {
    console.error("Error fetching suggested sellers:", error);
    res.status(500).json({ error: "Failed to fetch suggested sellers" });
  }
};

function getCategoryFromProjectCategory(projectCategory: string): string {
  const categoryMap: Record<string, string> = {
    professional: "PROFESSIONAL_SERVICES",
    services: "PROFESSIONAL_SERVICES",
    service: "PROFESSIONAL_SERVICES",
    consulting: "PROFESSIONAL_SERVICES",
    agency: "PROFESSIONAL_SERVICES",
    strategy: "PROFESSIONAL_SERVICES",
    marketing: "PROFESSIONAL_SERVICES",
    development: "PROFESSIONAL_SERVICES",
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

  // Get keys sorted by length descending for more specific matches first
  const patterns = Object.keys(categoryMap).sort((a, b) => b.length - a.length);
  const lowerProjectCategory = projectCategory.toLowerCase();

  for (const pattern of patterns) {
    if (lowerProjectCategory.includes(pattern)) {
      return categoryMap[pattern];
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

export const saveSeller = async (req: any, res: Response) => {
  try {
    const { sellerId, projectId } = req.body;

    const { user } = req;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if the seller already exists
    const existingSeller = await prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!existingSeller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Check if the project exists

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the user is the owner of the project

    if (existingProject.ownerId !== user.buyerId) {
      return res.status(403).json({ error: "Access denied" });
    }
    // Check if the seller is already saved for the project

    const existingSavedSeller = await prisma.project.findFirst({
      where: {
        savedSeller: {
          some: {
            id: sellerId,
          },
        },
      },
    });

    if (existingSavedSeller) {
      return res.status(400).json({ error: "Seller already saved" });
    }

    // Save the seller to the project

    await prisma.project.update({
      where: { id: projectId },
      data: {
        savedSeller: {
          connect: { id: sellerId },
        },
      },
    });
    res.status(200).json({ message: "Seller saved successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to save seller" });
  }
};

export const getSavedSellers = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const { user } = req;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if the project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        savedSeller: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the user is the owner of the project
    if (existingProject.ownerId !== user.buyerId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.status(200).json(existingProject.savedSeller);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to fetch saved sellers" });
  }
};

export const getHiredSellers = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const { user } = req;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if the project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        sellers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the user is the owner of the project
    if (existingProject.ownerId !== user.buyerId) {
      return res.status(403).json({ error: "Access denied" });
    }

    console.log("existingProject.sellers", existingProject.sellers);

    res.status(200).json(existingProject.sellers);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to fetch hired sellers" });
  }
};

export const removeSavedSeller = async (req: any, res: Response) => {
  try {
    const { sellerId, projectId } = req.body;

    // Check if the project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the user is the owner of the project
    if (existingProject.ownerId !== req.user.buyerId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Remove the saved seller from the project
    await prisma.project.update({
      where: { id: projectId },
      data: {
        savedSeller: {
          disconnect: { id: sellerId },
        },
      },
    });

    res.status(200).json({ message: "Seller removed successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to remove saved seller" });
  }
};

// send request to seller

export const sendRequest = async (req: any, res: Response) => {
  try {
    const { sellerId, projectId } = req.body;

    const { user } = req;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if the project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Check if the user is the owner of the project
    if (existingProject.ownerId !== user.buyerId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // create a request in db

    // do everything in a transaction

    const [request, seller] = await prisma.$transaction(async (tx) => {
      const request = await tx.projectReq.create({
        data: {
          projectId,
          sellerId,
          buyerId: user.buyerId,
        },
      });

      const seller = await tx.seller.findUnique({
        where: { id: sellerId },
        include: {
          user: true,
        },
      });

      if (!seller) {
        throw new Error("Seller not found");
      }

      await tx.notification.create({
        data: {
          userId: seller.userId,
          message: `You have a new project request from ${user.name}. Please check your dashboard for more details.`,
          type: "project-request",
        },
      });

      return [request, seller];
    });

    setImmediate(async () => {
      try {
        await resend.email.send({
          from: "hello@tejasgk.com",
          to: seller.user.email,
          subject: "New Project Request",
          html: `<p>You have a new project request from ${user.name}. Please check your dashboard for more details.</p>`,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Optional: log to monitoring service
      }
    });

    return res.status(200).json({ success: true, request });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to send request" });
  }
};
