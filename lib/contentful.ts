
import { createClient } from 'contentful';
import { createClient as createManagementClient } from 'contentful-management';

if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_DELIVERY_TOKEN) {
  throw new Error('Contentful configuration missing: SPACE_ID or DELIVERY_TOKEN not defined');
}

export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
});

export const contentfulManagementClient = createManagementClient({
  accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN || '',
});