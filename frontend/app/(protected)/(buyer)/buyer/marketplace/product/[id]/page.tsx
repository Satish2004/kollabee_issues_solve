"use"
import React from "react";
import ProductDetail, { ProductDetailData } from "./product-detail";
import { useMarketplaceProducts } from "../../hooks/use-marketplace";
import { productsApi } from "@/lib/api";

export default function ProductPage() {
  const productId = {
    "product": {
      "id": "9fcd7962-dd8f-41f9-90d9-124847e972ec",
      "name": "sizuka",
      "description": "",
      "price": 44,
      "wholesalePrice": 0,
      "minOrderQuantity": 1,
      "availableQuantity": 222,
      "images": [
        "https://res.cloudinary.com/dtggaphek/image/upload/v1751403062/product-images/sxvvwofh4cbsae9eby7m.jpg"
      ],
      "isDraft": false,
      "status": "DRAFT",
      "stockStatus": "IN_STOCK",
      "rating": 0,
      "reviewCount": 0,
      "attributes": {
        "Collar": "",
        "Fit Type": "",
        "Material": "",
        "Technics": "",
        "Fabric Type": "",
        "Fabric Weight": ""
      },
      "dimensions": null,
      "material": null,
      "artistName": null,
      "certifications": null,
      "rarity": null,
      "label": null,
      "techniques": null,
      "color": null,
      "fabricType": null,
      "fabricWeight": null,
      "fitType": null,
      "documents": [],
      "discount": null,
      "deliveryCost": 3,
      "certificateIssueDate": null,
      "galleryCertificateName": null,
      "sellerId": "915381aa-b258-4a53-9bd6-7361ded41330",
      "categoryId": "",
      "pickupAddressId": null,
      "createdAt": "2025-07-01T20:53:41.906Z",
      "updatedAt": "2025-07-01T20:53:41.906Z",
      "thumbnail": [
        "https://res.cloudinary.com/dtggaphek/image/upload/v1751403067/product-images/lvkdtuwjn81umyqcez2m.png"
      ],
      "productCategories": [],
      "seller": {
        "id": "915381aa-b258-4a53-9bd6-7361ded41330",
        "userId": "cba225e2-5d22-4cbd-803d-48e8b9306e85",
        "businessName": "runfly",
        "businessDescription": "ALl set to fly",
        "businessAddress": "runfly india a2342",
        "websiteLink": "runfly.in",
        "businessCategories": [
          "DESIGN & CREATIVE_SERVICES",
          "FASHION_APPAREL_ACCESSORIES"
        ],
        "businessTypes": [
          "DISTRIBUTOR",
          "MANUFACTURER",
          "SERVICE_PROVIDER"
        ],
        "businessLogo": "https://res.cloudinary.com/dtggaphek/image/upload/v1748676278/business-logos/zekv6ckihzwb753l5nhe.png",
        "yearFounded": null,
        "teamSize": "1000–5000",
        "annualRevenue": "$1M – $5M",
        "languagesSpoken": [],
        "businessAttributes": [
          "Sustainable / Eco-Friendly Practices"
        ],
        "bussinessRegistration": [],
        "servicesProvided": [
          "White Label Products",
          "Ready-to-Ship Products",
          "Custom Manufacturing"
        ],
        "minimumOrderQuantity": "6",
        "lowMoqFlexibility": true,
        "productionModel": "Outsourced",
        "productionCountries": [
          "India",
          "Germany",
          "Central African Republic"
        ],
        "providesSamples": true,
        "sampleDispatchTime": "3 weeks",
        "productionTimeline": "2 week",
        "factoryImages": [
          "https://res.cloudinary.com/dtggaphek/image/upload/v1747460804/factory-images/mq416yblaiyblrvsg61l.png",
          "https://res.cloudinary.com/dtggaphek/image/upload/v1747460846/factory-images/n57niyvu8b3d5kc5smyz.png",
          "https://res.cloudinary.com/dtggaphek/image/upload/v1747460867/factory-images/kfhnlf643d7ox44iibyz.png"
        ],
        "businessRegistration": [
          "https://res.cloudinary.com/dtggaphek/image/upload/v1749264180/profile-images/tvqmeqacdm5c9bgo6jus.png",
          "https://res.cloudinary.com/dtggaphek/image/upload/v1749266810/profile-images/hxmjmpnfosh0h6kddmua.jpg"
        ],
        "certificationTypes": [
          "ISO 9001",
          "ISO 14001",
          "ISO 45001"
        ],
        "certificates": [
          "https://res.cloudinary.com/dtggaphek/image/upload/v1748688126/profile-images/tx4ddz21y0kk5qu6hlt1.jpg"
        ],
        "projectImages": [
          "https://res.cloudinary.com/dtggaphek/image/upload/v1748689128/product-images/q6yg9nzs5mjugocrvmc1.jpg",
          "https://res.cloudinary.com/dtggaphek/image/upload/v1748689369/product-images/zuwns62llcgfo2rkhqbk.png"
        ],
        "brandVideo": "https://res.cloudinary.com/dtggaphek/video/upload/v1748690087/any-files/videos/meuncupeubbvl4dtzgga.mp4",
        "socialMediaLinks": "{\"instagram\":\"https://instagram.com/surajjbhardwa\",\"linkedin\":\"\",\"website\":\"\"}",
        "additionalNotes": "jhjkh",
        "employeeCount": null,
        "exportPercentage": null,
        "moq": null,
        "yearEstablished": null,
        "rating": 0,
        "location": null,
        "country": null,
        "state": null,
        "qualityControl": null,
        "rd": null,
        "roleInCompany": "Chief of work",
        "subCategories": {},
        "productionServices": [
          "bulk-manufacturing"
        ],
        "productionManagementType": "INHOUSE",
        "manufacturingLocations": [
          "cn"
        ],
        "targetAudience": [],
        "comments": "hey buddy ",
        "challenges": [
          "Difficulty reaching serious buyers",
          "Price pressure and margin squeeze",
          "Managing small batch/MOQ efficiently",
          "Complex compliance or certification demands",
          "Long lead times for closing deals",
          "Low brand visibility"
        ],
        "profileCompletion": [
          3,
          2,
          1,
          4,
          5,
          6,
          7
        ],
        "metrics": [
          "Number of quality leads",
          "New market penetration",
          "Volume/value of confirmed orders"
        ],
        "objectives": [
          "Expand into new markets",
          "Connect with high-quality buyers",
          "Increase brand visibility"
        ],
        "mainMarkets": [],
        "approvalRequested": true,
        "approvalReqestAt": "2025-06-01T05:08:43.588Z",
        "approved": true,
        "ApprovedId": "89648f01-4aa2-4596-bd0f-4d25c1eb3361",
        "lock": false,
        "lockedAt": "2025-06-07T04:26:26.355Z",
        "agrrement1": true,
        "agrrement2": true,
        "createdAt": "2025-06-01T05:59:42.242Z",
        "updatedAt": "2025-07-03T19:25:47.125Z",
        "user": {
          "id": "cba225e2-5d22-4cbd-803d-48e8b9306e85",
          "email": "pandeyyysuraj@gmail.com",
          "name": "Suraj Pandey",
          "firstName": "Suraj",
          "lastName": "Pandey",
          "role": "SELLER",
          "companyName": "runfly",
          "createdAt": "2025-03-21T04:57:33.684Z",
          "updatedAt": "2025-07-03T19:39:07.849Z",
          "companyWebsite": "runfly.in",
          "country": "India",
          "countryCode": null,
          "displayName": null,
          "fullName": null,
          "imageUrl": "https://res.cloudinary.com/dtggaphek/image/upload/v1746942898/profile-images/ukqu3agyxv1rfeg2vc84.jpg",
          "phoneNumber": "7079533373",
          "secondaryEmail": null,
          "state": "Bihar",
          "address": "runfly india hh",
          "zipCode": "845427",
          "lastLogin": "2025-07-03T19:39:07.848Z",
          "password": "$2a$10$v.6dLlSE1sTlzgjYIgd5m.irKX22.YcEgcBzS1kjD08Qc13vQHxia",
          "provider": null,
          "isActive": true
        }
      }
    },
    "relatedProducts": [
      {
        "id": "05370846-3a20-477d-899e-c5a911e63ee8",
        "name": "db name bro",
        "description": "",
        "price": 1200,
        "wholesalePrice": 0,
        "minOrderQuantity": 1,
        "availableQuantity": 500,
        "images": [],
        "isDraft": false,
        "status": "DRAFT",
        "stockStatus": "IN_STOCK",
        "rating": 0,
        "reviewCount": 0,
        "attributes": {
          "length": "kamk"
        },
        "dimensions": null,
        "material": null,
        "artistName": null,
        "certifications": null,
        "rarity": null,
        "label": null,
        "techniques": null,
        "color": null,
        "fabricType": null,
        "fabricWeight": null,
        "fitType": null,
        "documents": [],
        "discount": null,
        "deliveryCost": null,
        "certificateIssueDate": null,
        "galleryCertificateName": null,
        "sellerId": "915381aa-b258-4a53-9bd6-7361ded41330",
        "categoryId": "",
        "pickupAddressId": null,
        "createdAt": "2025-03-21T06:05:11.454Z",
        "updatedAt": "2025-03-21T06:05:11.454Z",
        "thumbnail": [],
        "productCategories": [
          "BEAUTY_COSMETICS"
        ],
        "seller": {
          "id": "915381aa-b258-4a53-9bd6-7361ded41330",
          "userId": "cba225e2-5d22-4cbd-803d-48e8b9306e85",
          "businessName": "runfly",
          "businessDescription": "ALl set to fly",
          "businessAddress": "runfly india a2342",
          "websiteLink": "runfly.in",
          "businessCategories": [
            "DESIGN & CREATIVE_SERVICES",
            "FASHION_APPAREL_ACCESSORIES"
          ],
          "businessTypes": [
            "DISTRIBUTOR",
            "MANUFACTURER",
            "SERVICE_PROVIDER"
          ],
          "businessLogo": "https://res.cloudinary.com/dtggaphek/image/upload/v1748676278/business-logos/zekv6ckihzwb753l5nhe.png",
          "yearFounded": null,
          "teamSize": "1000–5000",
          "annualRevenue": "$1M – $5M",
          "languagesSpoken": [],
          "businessAttributes": [
            "Sustainable / Eco-Friendly Practices"
          ],
          "bussinessRegistration": [],
          "servicesProvided": [
            "White Label Products",
            "Ready-to-Ship Products",
            "Custom Manufacturing"
          ],
          "minimumOrderQuantity": "6",
          "lowMoqFlexibility": true,
          "productionModel": "Outsourced",
          "productionCountries": [
            "India",
            "Germany",
            "Central African Republic"
          ],
          "providesSamples": true,
          "sampleDispatchTime": "3 weeks",
          "productionTimeline": "2 week",
          "factoryImages": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460804/factory-images/mq416yblaiyblrvsg61l.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460846/factory-images/n57niyvu8b3d5kc5smyz.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460867/factory-images/kfhnlf643d7ox44iibyz.png"
          ],
          "businessRegistration": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1749264180/profile-images/tvqmeqacdm5c9bgo6jus.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1749266810/profile-images/hxmjmpnfosh0h6kddmua.jpg"
          ],
          "certificationTypes": [
            "ISO 9001",
            "ISO 14001",
            "ISO 45001"
          ],
          "certificates": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748688126/profile-images/tx4ddz21y0kk5qu6hlt1.jpg"
          ],
          "projectImages": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748689128/product-images/q6yg9nzs5mjugocrvmc1.jpg",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748689369/product-images/zuwns62llcgfo2rkhqbk.png"
          ],
          "brandVideo": "https://res.cloudinary.com/dtggaphek/video/upload/v1748690087/any-files/videos/meuncupeubbvl4dtzgga.mp4",
          "socialMediaLinks": "{\"instagram\":\"https://instagram.com/surajjbhardwa\",\"linkedin\":\"\",\"website\":\"\"}",
          "additionalNotes": "jhjkh",
          "employeeCount": null,
          "exportPercentage": null,
          "moq": null,
          "yearEstablished": null,
          "rating": 0,
          "location": null,
          "country": null,
          "state": null,
          "qualityControl": null,
          "rd": null,
          "roleInCompany": "Chief of work",
          "subCategories": {},
          "productionServices": [
            "bulk-manufacturing"
          ],
          "productionManagementType": "INHOUSE",
          "manufacturingLocations": [
            "cn"
          ],
          "targetAudience": [],
          "comments": "hey buddy ",
          "challenges": [
            "Difficulty reaching serious buyers",
            "Price pressure and margin squeeze",
            "Managing small batch/MOQ efficiently",
            "Complex compliance or certification demands",
            "Long lead times for closing deals",
            "Low brand visibility"
          ],
          "profileCompletion": [
            3,
            2,
            1,
            4,
            5,
            6,
            7
          ],
          "metrics": [
            "Number of quality leads",
            "New market penetration",
            "Volume/value of confirmed orders"
          ],
          "objectives": [
            "Expand into new markets",
            "Connect with high-quality buyers",
            "Increase brand visibility"
          ],
          "mainMarkets": [],
          "approvalRequested": true,
          "approvalReqestAt": "2025-06-01T05:08:43.588Z",
          "approved": true,
          "ApprovedId": "89648f01-4aa2-4596-bd0f-4d25c1eb3361",
          "lock": false,
          "lockedAt": "2025-06-07T04:26:26.355Z",
          "agrrement1": true,
          "agrrement2": true,
          "createdAt": "2025-06-01T05:59:42.242Z",
          "updatedAt": "2025-07-03T19:25:47.125Z"
        }
      },
      {
        "id": "17f603ea-619f-4552-af97-ecdd22179665",
        "name": "ASS",
        "description": "",
        "price": 22,
        "wholesalePrice": 0,
        "minOrderQuantity": 1,
        "availableQuantity": 1111,
        "images": [
          "https://res.cloudinary.com/dtggaphek/image/upload/v1751479328/product-images/ywha5q1pgwry0xuo6bkg.png"
        ],
        "isDraft": false,
        "status": "DRAFT",
        "stockStatus": "IN_STOCK",
        "rating": 0,
        "reviewCount": 0,
        "attributes": {
          "Collar": "",
          "Fit Type": "",
          "Material": "",
          "Technics": "",
          "Fabric Type": "",
          "Fabric Weight": ""
        },
        "dimensions": null,
        "material": null,
        "artistName": null,
        "certifications": null,
        "rarity": null,
        "label": null,
        "techniques": null,
        "color": null,
        "fabricType": null,
        "fabricWeight": null,
        "fitType": null,
        "documents": [],
        "discount": null,
        "deliveryCost": 222,
        "certificateIssueDate": null,
        "galleryCertificateName": null,
        "sellerId": "915381aa-b258-4a53-9bd6-7361ded41330",
        "categoryId": null,
        "pickupAddressId": null,
        "createdAt": "2025-07-02T18:04:47.175Z",
        "updatedAt": "2025-07-02T18:04:47.175Z",
        "thumbnail": [
          "https://res.cloudinary.com/dtggaphek/image/upload/v1751479338/product-images/nucd8ainvamldetohdon.jpg"
        ],
        "productCategories": [
          "HEALTH_WELLNESS",
          "HOME_CLEANING_ESSENTIALS"
        ],
        "seller": {
          "id": "915381aa-b258-4a53-9bd6-7361ded41330",
          "userId": "cba225e2-5d22-4cbd-803d-48e8b9306e85",
          "businessName": "runfly",
          "businessDescription": "ALl set to fly",
          "businessAddress": "runfly india a2342",
          "websiteLink": "runfly.in",
          "businessCategories": [
            "DESIGN & CREATIVE_SERVICES",
            "FASHION_APPAREL_ACCESSORIES"
          ],
          "businessTypes": [
            "DISTRIBUTOR",
            "MANUFACTURER",
            "SERVICE_PROVIDER"
          ],
          "businessLogo": "https://res.cloudinary.com/dtggaphek/image/upload/v1748676278/business-logos/zekv6ckihzwb753l5nhe.png",
          "yearFounded": null,
          "teamSize": "1000–5000",
          "annualRevenue": "$1M – $5M",
          "languagesSpoken": [],
          "businessAttributes": [
            "Sustainable / Eco-Friendly Practices"
          ],
          "bussinessRegistration": [],
          "servicesProvided": [
            "White Label Products",
            "Ready-to-Ship Products",
            "Custom Manufacturing"
          ],
          "minimumOrderQuantity": "6",
          "lowMoqFlexibility": true,
          "productionModel": "Outsourced",
          "productionCountries": [
            "India",
            "Germany",
            "Central African Republic"
          ],
          "providesSamples": true,
          "sampleDispatchTime": "3 weeks",
          "productionTimeline": "2 week",
          "factoryImages": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460804/factory-images/mq416yblaiyblrvsg61l.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460846/factory-images/n57niyvu8b3d5kc5smyz.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460867/factory-images/kfhnlf643d7ox44iibyz.png"
          ],
          "businessRegistration": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1749264180/profile-images/tvqmeqacdm5c9bgo6jus.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1749266810/profile-images/hxmjmpnfosh0h6kddmua.jpg"
          ],
          "certificationTypes": [
            "ISO 9001",
            "ISO 14001",
            "ISO 45001"
          ],
          "certificates": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748688126/profile-images/tx4ddz21y0kk5qu6hlt1.jpg"
          ],
          "projectImages": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748689128/product-images/q6yg9nzs5mjugocrvmc1.jpg",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748689369/product-images/zuwns62llcgfo2rkhqbk.png"
          ],
          "brandVideo": "https://res.cloudinary.com/dtggaphek/video/upload/v1748690087/any-files/videos/meuncupeubbvl4dtzgga.mp4",
          "socialMediaLinks": "{\"instagram\":\"https://instagram.com/surajjbhardwa\",\"linkedin\":\"\",\"website\":\"\"}",
          "additionalNotes": "jhjkh",
          "employeeCount": null,
          "exportPercentage": null,
          "moq": null,
          "yearEstablished": null,
          "rating": 0,
          "location": null,
          "country": null,
          "state": null,
          "qualityControl": null,
          "rd": null,
          "roleInCompany": "Chief of work",
          "subCategories": {},
          "productionServices": [
            "bulk-manufacturing"
          ],
          "productionManagementType": "INHOUSE",
          "manufacturingLocations": [
            "cn"
          ],
          "targetAudience": [],
          "comments": "hey buddy ",
          "challenges": [
            "Difficulty reaching serious buyers",
            "Price pressure and margin squeeze",
            "Managing small batch/MOQ efficiently",
            "Complex compliance or certification demands",
            "Long lead times for closing deals",
            "Low brand visibility"
          ],
          "profileCompletion": [
            3,
            2,
            1,
            4,
            5,
            6,
            7
          ],
          "metrics": [
            "Number of quality leads",
            "New market penetration",
            "Volume/value of confirmed orders"
          ],
          "objectives": [
            "Expand into new markets",
            "Connect with high-quality buyers",
            "Increase brand visibility"
          ],
          "mainMarkets": [],
          "approvalRequested": true,
          "approvalReqestAt": "2025-06-01T05:08:43.588Z",
          "approved": true,
          "ApprovedId": "89648f01-4aa2-4596-bd0f-4d25c1eb3361",
          "lock": false,
          "lockedAt": "2025-06-07T04:26:26.355Z",
          "agrrement1": true,
          "agrrement2": true,
          "createdAt": "2025-06-01T05:59:42.242Z",
          "updatedAt": "2025-07-03T19:25:47.125Z"
        }
      },
      {
        "id": "22172baa-1937-4ea4-aff0-de2169c1f14e",
        "name": "raja babu2",
        "description": "",
        "price": 20,
        "wholesalePrice": 0,
        "minOrderQuantity": 1,
        "availableQuantity": 50,
        "images": [
          "https://res.cloudinary.com/dtggaphek/image/upload/v1743091877/product-images/ao1tkaw6c9msmuxtmuzw.jpg"
        ],
        "isDraft": false,
        "status": "DRAFT",
        "stockStatus": "IN_STOCK",
        "rating": 0,
        "reviewCount": 0,
        "attributes": {
          "Collar": "",
          "Fit Type": "",
          "Material": "",
          "Technics": "",
          "Fabric Type": "",
          "Fabric Weight": ""
        },
        "dimensions": null,
        "material": null,
        "artistName": null,
        "certifications": null,
        "rarity": null,
        "label": null,
        "techniques": null,
        "color": null,
        "fabricType": null,
        "fabricWeight": null,
        "fitType": null,
        "documents": [],
        "discount": 10,
        "deliveryCost": 10,
        "certificateIssueDate": null,
        "galleryCertificateName": null,
        "sellerId": "915381aa-b258-4a53-9bd6-7361ded41330",
        "categoryId": "",
        "pickupAddressId": null,
        "createdAt": "2025-03-27T12:34:54.073Z",
        "updatedAt": "2025-03-27T16:11:26.776Z",
        "thumbnail": [],
        "productCategories": [],
        "seller": {
          "id": "915381aa-b258-4a53-9bd6-7361ded41330",
          "userId": "cba225e2-5d22-4cbd-803d-48e8b9306e85",
          "businessName": "runfly",
          "businessDescription": "ALl set to fly",
          "businessAddress": "runfly india a2342",
          "websiteLink": "runfly.in",
          "businessCategories": [
            "DESIGN & CREATIVE_SERVICES",
            "FASHION_APPAREL_ACCESSORIES"
          ],
          "businessTypes": [
            "DISTRIBUTOR",
            "MANUFACTURER",
            "SERVICE_PROVIDER"
          ],
          "businessLogo": "https://res.cloudinary.com/dtggaphek/image/upload/v1748676278/business-logos/zekv6ckihzwb753l5nhe.png",
          "yearFounded": null,
          "teamSize": "1000–5000",
          "annualRevenue": "$1M – $5M",
          "languagesSpoken": [],
          "businessAttributes": [
            "Sustainable / Eco-Friendly Practices"
          ],
          "bussinessRegistration": [],
          "servicesProvided": [
            "White Label Products",
            "Ready-to-Ship Products",
            "Custom Manufacturing"
          ],
          "minimumOrderQuantity": "6",
          "lowMoqFlexibility": true,
          "productionModel": "Outsourced",
          "productionCountries": [
            "India",
            "Germany",
            "Central African Republic"
          ],
          "providesSamples": true,
          "sampleDispatchTime": "3 weeks",
          "productionTimeline": "2 week",
          "factoryImages": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460804/factory-images/mq416yblaiyblrvsg61l.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460846/factory-images/n57niyvu8b3d5kc5smyz.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460867/factory-images/kfhnlf643d7ox44iibyz.png"
          ],
          "businessRegistration": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1749264180/profile-images/tvqmeqacdm5c9bgo6jus.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1749266810/profile-images/hxmjmpnfosh0h6kddmua.jpg"
          ],
          "certificationTypes": [
            "ISO 9001",
            "ISO 14001",
            "ISO 45001"
          ],
          "certificates": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748688126/profile-images/tx4ddz21y0kk5qu6hlt1.jpg"
          ],
          "projectImages": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748689128/product-images/q6yg9nzs5mjugocrvmc1.jpg",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748689369/product-images/zuwns62llcgfo2rkhqbk.png"
          ],
          "brandVideo": "https://res.cloudinary.com/dtggaphek/video/upload/v1748690087/any-files/videos/meuncupeubbvl4dtzgga.mp4",
          "socialMediaLinks": "{\"instagram\":\"https://instagram.com/surajjbhardwa\",\"linkedin\":\"\",\"website\":\"\"}",
          "additionalNotes": "jhjkh",
          "employeeCount": null,
          "exportPercentage": null,
          "moq": null,
          "yearEstablished": null,
          "rating": 0,
          "location": null,
          "country": null,
          "state": null,
          "qualityControl": null,
          "rd": null,
          "roleInCompany": "Chief of work",
          "subCategories": {},
          "productionServices": [
            "bulk-manufacturing"
          ],
          "productionManagementType": "INHOUSE",
          "manufacturingLocations": [
            "cn"
          ],
          "targetAudience": [],
          "comments": "hey buddy ",
          "challenges": [
            "Difficulty reaching serious buyers",
            "Price pressure and margin squeeze",
            "Managing small batch/MOQ efficiently",
            "Complex compliance or certification demands",
            "Long lead times for closing deals",
            "Low brand visibility"
          ],
          "profileCompletion": [
            3,
            2,
            1,
            4,
            5,
            6,
            7
          ],
          "metrics": [
            "Number of quality leads",
            "New market penetration",
            "Volume/value of confirmed orders"
          ],
          "objectives": [
            "Expand into new markets",
            "Connect with high-quality buyers",
            "Increase brand visibility"
          ],
          "mainMarkets": [],
          "approvalRequested": true,
          "approvalReqestAt": "2025-06-01T05:08:43.588Z",
          "approved": true,
          "ApprovedId": "89648f01-4aa2-4596-bd0f-4d25c1eb3361",
          "lock": false,
          "lockedAt": "2025-06-07T04:26:26.355Z",
          "agrrement1": true,
          "agrrement2": true,
          "createdAt": "2025-06-01T05:59:42.242Z",
          "updatedAt": "2025-07-03T19:25:47.125Z"
        }
      },
      {
        "id": "3616f517-da7a-438c-ad28-bb5756c8fe96",
        "name": "suraj",
        "description": "",
        "price": 1200,
        "wholesalePrice": 0,
        "minOrderQuantity": 2,
        "availableQuantity": 12,
        "images": [
          "https://res.cloudinary.com/dtggaphek/image/upload/v1742542744/product-images/s0phlyibsdjbycff5iq6.jpg"
        ],
        "isDraft": false,
        "status": "DRAFT",
        "stockStatus": "IN_STOCK",
        "rating": 0,
        "reviewCount": 0,
        "attributes": {
          "Collar": "",
          "Fit Type": "",
          "Material": "",
          "Technics": "",
          "Fabric Type": "",
          "Fabric Weight": ""
        },
        "dimensions": null,
        "material": null,
        "artistName": null,
        "certifications": null,
        "rarity": null,
        "label": null,
        "techniques": null,
        "color": null,
        "fabricType": null,
        "fabricWeight": null,
        "fitType": null,
        "documents": [],
        "discount": 20,
        "deliveryCost": 120,
        "certificateIssueDate": null,
        "galleryCertificateName": null,
        "sellerId": "915381aa-b258-4a53-9bd6-7361ded41330",
        "categoryId": "",
        "pickupAddressId": null,
        "createdAt": "2025-03-21T07:56:07.340Z",
        "updatedAt": "2025-03-21T07:56:07.340Z",
        "thumbnail": [],
        "productCategories": [],
        "seller": {
          "id": "915381aa-b258-4a53-9bd6-7361ded41330",
          "userId": "cba225e2-5d22-4cbd-803d-48e8b9306e85",
          "businessName": "runfly",
          "businessDescription": "ALl set to fly",
          "businessAddress": "runfly india a2342",
          "websiteLink": "runfly.in",
          "businessCategories": [
            "DESIGN & CREATIVE_SERVICES",
            "FASHION_APPAREL_ACCESSORIES"
          ],
          "businessTypes": [
            "DISTRIBUTOR",
            "MANUFACTURER",
            "SERVICE_PROVIDER"
          ],
          "businessLogo": "https://res.cloudinary.com/dtggaphek/image/upload/v1748676278/business-logos/zekv6ckihzwb753l5nhe.png",
          "yearFounded": null,
          "teamSize": "1000–5000",
          "annualRevenue": "$1M – $5M",
          "languagesSpoken": [],
          "businessAttributes": [
            "Sustainable / Eco-Friendly Practices"
          ],
          "bussinessRegistration": [],
          "servicesProvided": [
            "White Label Products",
            "Ready-to-Ship Products",
            "Custom Manufacturing"
          ],
          "minimumOrderQuantity": "6",
          "lowMoqFlexibility": true,
          "productionModel": "Outsourced",
          "productionCountries": [
            "India",
            "Germany",
            "Central African Republic"
          ],
          "providesSamples": true,
          "sampleDispatchTime": "3 weeks",
          "productionTimeline": "2 week",
          "factoryImages": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460804/factory-images/mq416yblaiyblrvsg61l.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460846/factory-images/n57niyvu8b3d5kc5smyz.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1747460867/factory-images/kfhnlf643d7ox44iibyz.png"
          ],
          "businessRegistration": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1749264180/profile-images/tvqmeqacdm5c9bgo6jus.png",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1749266810/profile-images/hxmjmpnfosh0h6kddmua.jpg"
          ],
          "certificationTypes": [
            "ISO 9001",
            "ISO 14001",
            "ISO 45001"
          ],
          "certificates": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748688126/profile-images/tx4ddz21y0kk5qu6hlt1.jpg"
          ],
          "projectImages": [
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748689128/product-images/q6yg9nzs5mjugocrvmc1.jpg",
            "https://res.cloudinary.com/dtggaphek/image/upload/v1748689369/product-images/zuwns62llcgfo2rkhqbk.png"
          ],
          "brandVideo": "https://res.cloudinary.com/dtggaphek/video/upload/v1748690087/any-files/videos/meuncupeubbvl4dtzgga.mp4",
          "socialMediaLinks": "{\"instagram\":\"https://instagram.com/surajjbhardwa\",\"linkedin\":\"\",\"website\":\"\"}",
          "additionalNotes": "jhjkh",
          "employeeCount": null,
          "exportPercentage": null,
          "moq": null,
          "yearEstablished": null,
          "rating": 0,
          "location": null,
          "country": null,
          "state": null,
          "qualityControl": null,
          "rd": null,
          "roleInCompany": "Chief of work",
          "subCategories": {},
          "productionServices": [
            "bulk-manufacturing"
          ],
          "productionManagementType": "INHOUSE",
          "manufacturingLocations": [
            "cn"
          ],
          "targetAudience": [],
          "comments": "hey buddy ",
          "challenges": [
            "Difficulty reaching serious buyers",
            "Price pressure and margin squeeze",
            "Managing small batch/MOQ efficiently",
            "Complex compliance or certification demands",
            "Long lead times for closing deals",
            "Low brand visibility"
          ],
          "profileCompletion": [
            3,
            2,
            1,
            4,
            5,
            6,
            7
          ],
          "metrics": [
            "Number of quality leads",
            "New market penetration",
            "Volume/value of confirmed orders"
          ],
          "objectives": [
            "Expand into new markets",
            "Connect with high-quality buyers",
            "Increase brand visibility"
          ],
          "mainMarkets": [],
          "approvalRequested": true,
          "approvalReqestAt": "2025-06-01T05:08:43.588Z",
          "approved": true,
          "ApprovedId": "89648f01-4aa2-4596-bd0f-4d25c1eb3361",
          "lock": false,
          "lockedAt": "2025-06-07T04:26:26.355Z",
          "agrrement1": true,
          "agrrement2": true,
          "createdAt": "2025-06-01T05:59:42.242Z",
          "updatedAt": "2025-07-03T19:25:47.125Z"
        }
      }
    ]
  }

  return (
    <div>
      <ProductDetail product={productId.product} />
    </div>
  );
}
