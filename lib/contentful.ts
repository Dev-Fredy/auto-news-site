// lib/contentful.ts
import { createClient } from 'contentful';
import contentfulManagement from 'contentful-management';

// Content Delivery API client (for reading published content)
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
});

// Content Management API client (for creating/updating content)
export const contentfulManagementClient = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!,
});