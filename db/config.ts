import { defineDb, defineTable, column } from 'astro:db';

// Collections table - top level (5-6 collections)
const Collections = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text({ unique: true }),
    slug: column.text({ unique: true }),
    description: column.text(),
    thumbnail: column.text(), // filename for collection thumbnail
    createdAt: column.date({ default: new Date() }),
  }
});

// Coins table - middle level (40-50 coins per collection)
const Coins = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    collectionId: column.number({ references: () => Collections.columns.id }),
    name: column.text(),
    slug: column.text(),
    description: column.text({ optional: true }),
    year: column.number({ optional: true }),
    mintage: column.text({ optional: true }),
    condition: column.text({ optional: true }),
    primaryImage: column.text(), // filename for main coin image (used in gallery)
    sortOrder: column.number({ default: 0 }), // for ordering coins within a collection
    createdAt: column.date({ default: new Date() }),
  },
  indexes: {
    collectionSlugIdx: { on: ['collectionId', 'slug'], unique: true },
  }
});

// Images table - bottom level (5 images per coin)
const Images = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    coinId: column.number({ references: () => Coins.columns.id }),
    filename: column.text(),
    title: column.text(), // title for each image as requested
    alt: column.text(),
    description: column.text({ optional: true }),
    isPrimary: column.boolean({ default: false }), // marks the main image
    sortOrder: column.number({ default: 1 }), // for ordering the 5 images
    createdAt: column.date({ default: new Date() }),
  },
  indexes: {
    coinIdIdx: { on: ['coinId'] },
    primaryIdx: { on: ['coinId', 'isPrimary'] },
  }
});

// Admin users table for authentication
const AdminUsers = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    username: column.text({ unique: true }),
    passwordHash: column.text(), // bcrypt hashed password
    email: column.text({ optional: true }),
    isActive: column.boolean({ default: true }),
    lastLogin: column.date({ optional: true }),
    createdAt: column.date({ default: new Date() }),
  },
  indexes: {
    usernameIdx: { on: ['username'], unique: true },
  }
});

// Admin sessions table for managing login sessions
const AdminSessions = defineTable({
  columns: {
    id: column.text({ primaryKey: true }), // session token
    userId: column.number({ references: () => AdminUsers.columns.id }),
    expiresAt: column.date(),
    createdAt: column.date({ default: new Date() }),
  },
  indexes: {
    userIdIdx: { on: ['userId'] },
    expiresIdx: { on: ['expiresAt'] },
  }
});

// Static pages table for editable content (about, landing, etc.)
const Pages = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    slug: column.text({ unique: true }), // 'about', 'home', etc.
    title: column.text(),
    description: column.text({ optional: true }),
    content: column.text(), // Markdown or HTML content
    heroImage: column.text({ optional: true }), // Vercel Blob URL
    metaTitle: column.text({ optional: true }), // SEO title
    metaDescription: column.text({ optional: true }), // SEO description
    isPublished: column.boolean({ default: true }),
    updatedAt: column.date({ optional: true }),
    createdAt: column.date({ default: new Date() }),
  },
  indexes: {
    pageSlugIdx: { on: ['slug'], unique: true },
  }
});

// Blog posts table
const BlogPosts = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    slug: column.text({ unique: true }),
    title: column.text(),
    description: column.text(),
    content: column.text(), // Markdown content
    heroImage: column.text({ optional: true }),
    pubDate: column.date(),
    updatedDate: column.date({ optional: true }),
    createdAt: column.date({ default: new Date() }),
  },
  indexes: {
    slugIdx: { on: ['slug'], unique: true },
    pubDateIdx: { on: ['pubDate'] },
  }
});

export default defineDb({
  tables: {
    Collections,
    Coins,
    Images,
    AdminUsers,
    AdminSessions,
    Pages,
    BlogPosts,
  }
});