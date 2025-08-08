export enum CategoryEnum {
    FASHION_APPAREL_ACCESSORIES = "FASHION_APPAREL_ACCESSORIES",
    BEAUTY_COSMETICS = "BEAUTY_COSMETICS",
    HOME_CLEANING_ESSENTIALS = "HOME_CLEANING_ESSENTIALS",
    HERBAL_NATURAL_PRODUCTS = "HERBAL_NATURAL_PRODUCTS",
    FOOD_BEVERAGES = "FOOD_BEVERAGES",
    HEALTH_WELLNESS = "HEALTH_WELLNESS",
    OTHER = "OTHER",
    BRAND_STRATEGY_DEVELOPMENT = "BRAND_STRATEGY_DEVELOPMENT",
    DESIGN_CREATIVE_SERVICES = "DESIGN_CREATIVE_SERVICES",
    DIGITAL_MARKETING = "DIGITAL_MARKETING",
    WEB_ECOMMERCE_DEVELOPMENT = "WEB_ECOMMERCE_DEVELOPMENT",
    PHOTOGRAPHY_VIDEOGRAPHY = "PHOTOGRAPHY_VIDEOGRAPHY",
    MARKET_RESEARCH_ANALYTICS = "MARKET_RESEARCH_ANALYTICS",
    PUBLIC_RELATIONS_OUTREACH = "PUBLIC_RELATIONS_OUTREACH",
    RETAIL_ECOMMERCE_STRATEGY = "RETAIL_ECOMMERCE_STRATEGY",
    CONTENT_CREATION_COPYWRITING = "CONTENT_CREATION_COPYWRITING",
    CONSULTING_SERVICES = "CONSULTING_SERVICES",
    PRIMARY_PACKAGING = "PRIMARY_PACKAGING",
    FLEXIBLE_PACKAGING = "FLEXIBLE_PACKAGING",
    RIGID_PACKAGING = "RIGID_PACKAGING",
    COMPONENTS_ACCESSORIES = "COMPONENTS_ACCESSORIES",
    SUSTAINABLE_PACKAGING = "SUSTAINABLE_PACKAGING",
    SECONDARY_PACKAGING = "SECONDARY_PACKAGING",
    AYURVEDA_HERBAL = "AYURVEDA_HERBAL",
    BEAUTY = "BEAUTY",
    BEVERAGES = "BEVERAGES",
    COSMETICS = "COSMETICS",
    CLEANING_HOME_CARE_KITCHEN = "CLEANING_HOME_CARE_KITCHEN",
    CONSUMER_ELECTRONICS = "CONSUMER_ELECTRONICS",
    FOOD = "FOOD",
    FURNITURE_HOME_DECOR = "FURNITURE_HOME_DECOR",
    FASHION_ACCESSORIES = "FASHION_ACCESSORIES",
    HEALTH_WELLNESS_DUPLICATE = "HEALTH_WELLNESS_DUPLICATE",
    INGREDIENTS = "INGREDIENTS",
    FLAVOURS = "FLAVOURS",
    FRAGRANCES = "FRAGRANCES",
    MOTHER_BABY_CARE = "MOTHER_BABY_CARE",
    NATURAL_ORGANIC_PRODUCTS = "NATURAL_ORGANIC_PRODUCTS",
    PERSONAL_CARE_HYGIENE = "PERSONAL_CARE_HYGIENE",
    PET_CARE_PRODUCTS = "PET_CARE_PRODUCTS",
    TEA_COFFEE = "TEA_COFFEE",
    TEXTILES_APPAREL = "TEXTILES_APPAREL",
    TOYS = "TOYS",
}

export const CategoryOptions = Object.values(CategoryEnum);



import {
    Shirt, Sparkles, Home, Leaf, Coffee, HeartPulse,
    Briefcase, Paintbrush, Globe, Laptop, Camera, LineChart,
    Megaphone, ShoppingCart, Users, Package, Layers,
    Box, Puzzle, Archive, Apple, Flame, Droplets,
    Baby, PawPrint, CupSoda, ToyBrick
} from "lucide-react";

import { Upload, X, Loader2, Plus, ChevronLeft, Check, FileText, Menu, ChevronDown } from "lucide-react"


export const CATEGORY_OPTIONS = [
    { value: "FASHION_APPAREL_ACCESSORIES", label: "Fashion", icon: <Shirt className="w-4 h-4" /> },
    { value: "BEAUTY_COSMETICS", label: "Beauty", icon: <Sparkles className="w-4 h-4" /> },
    { value: "HOME_CLEANING_ESSENTIALS", label: "Home", icon: <Home className="w-4 h-4" /> },
    { value: "HERBAL_NATURAL_PRODUCTS", label: "Herbal", icon: <Leaf className="w-4 h-4" /> },
    { value: "FOOD_BEVERAGES", label: "Food", icon: <Coffee className="w-4 h-4" /> },
    { value: "HEALTH_WELLNESS", label: "Wellness", icon: <HeartPulse className="w-4 h-4" /> },

    { value: "BRAND_STRATEGY_DEVELOPMENT", label: "Brand", icon: <Briefcase className="w-4 h-4" /> },
    { value: "DESIGN_CREATIVE_SERVICES", label: "Design", icon: <Paintbrush className="w-4 h-4" /> },
    { value: "DIGITAL_MARKETING", label: "Marketing", icon: <Globe className="w-4 h-4" /> },
    { value: "WEB_ECOMMERCE_DEVELOPMENT", label: "Web Dev", icon: <Laptop className="w-4 h-4" /> },
    { value: "PHOTOGRAPHY_VIDEOGRAPHY", label: "Photo", icon: <Camera className="w-4 h-4" /> },
    { value: "MARKET_RESEARCH_ANALYTICS", label: "Analytics", icon: <LineChart className="w-4 h-4" /> },
    { value: "PUBLIC_RELATIONS_OUTREACH", label: "PR", icon: <Megaphone className="w-4 h-4" /> },
    { value: "RETAIL_ECOMMERCE_STRATEGY", label: "Retail", icon: <ShoppingCart className="w-4 h-4" /> },
    { value: "CONTENT_CREATION_COPYWRITING", label: "Content", icon: <FileText className="w-4 h-4" /> },
    { value: "CONSULTING_SERVICES", label: "Consulting", icon: <Users className="w-4 h-4" /> },

    { value: "PRIMARY_PACKAGING", label: "Primary Pack", icon: <Package className="w-4 h-4" /> },
    { value: "FLEXIBLE_PACKAGING", label: "Flexible Pack", icon: <Layers className="w-4 h-4" /> },
    { value: "RIGID_PACKAGING", label: "Rigid Pack", icon: <Box className="w-4 h-4" /> },
    { value: "COMPONENTS_ACCESSORIES", label: "Accessories", icon: <Puzzle className="w-4 h-4" /> },
    { value: "SUSTAINABLE_PACKAGING", label: "Sustainable", icon: <Leaf className="w-4 h-4" /> },
    { value: "SECONDARY_PACKAGING", label: "Secondary", icon: <Archive className="w-4 h-4" /> },

    { value: "AYURVEDA_HERBAL", label: "Ayurveda", icon: <Leaf className="w-4 h-4" /> },
    { value: "BEVERAGES", label: "Beverages", icon: <CupSoda className="w-4 h-4" /> },
    { value: "COSMETICS", label: "Cosmetics", icon: <Sparkles className="w-4 h-4" /> },
    { value: "CLEANING_HOME_CARE_KITCHEN", label: "Cleaning", icon: <Home className="w-4 h-4" /> },
    { value: "CONSUMER_ELECTRONICS", label: "Electronics", icon: <Flame className="w-4 h-4" /> },
    { value: "FURNITURE_HOME_DECOR", label: "Furniture", icon: <Home className="w-4 h-4" /> },
    { value: "FASHION_ACCESSORIES", label: "Accessories", icon: <Shirt className="w-4 h-4" /> },
    { value: "HEALTH_WELLNESS_DUPLICATE", label: "Wellness", icon: <HeartPulse className="w-4 h-4" /> },
    { value: "MOTHER_BABY_CARE", label: "Baby", icon: <Baby className="w-4 h-4" /> },
    { value: "NATURAL_ORGANIC_PRODUCTS", label: "Organic", icon: <Apple className="w-4 h-4" /> },
    { value: "PERSONAL_CARE_HYGIENE", label: "Hygiene", icon: <Droplets className="w-4 h-4" /> },
    { value: "PET_CARE_PRODUCTS", label: "Pet Care", icon: <PawPrint className="w-4 h-4" /> },
    { value: "TEA_COFFEE", label: "Tea & Coffee", icon: <CupSoda className="w-4 h-4" /> },
    { value: "TEXTILES_APPAREL", label: "Textiles", icon: <Shirt className="w-4 h-4" /> },
    { value: "TOYS", label: "Toys", icon: <ToyBrick className="w-4 h-4" /> },
]   
  