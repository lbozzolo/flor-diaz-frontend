import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.strapi.app', // Permite subdominios de Strapi Cloud
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Por si usas Cloudinary para medios
      },
      // Si tus imágenes se guardan en AWS S3, necesitarías agregar ese dominio aquí también
    ],
  },
};

export default nextConfig;