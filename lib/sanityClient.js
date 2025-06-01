// lib/sanityClient.js
import  createClient  from '@sanity/client';
import imageUrlBuilder from "@sanity/image-url";

const sanityClient = createClient({
  projectId: "dc7bo6bv", // Replace with your Sanity project ID
  dataset: "production",
  apiVersion: "2025-05-23", // Use today's date or the one you're confident is supported
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const builder = imageUrlBuilder(sanityClient);

// This returns the builder object, which has `.url()` function
export const urlFor = (source) => builder.image(source);

export default sanityClient;
