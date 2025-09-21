import type { APIRoute } from 'astro';
import { db, AdminUsers } from 'astro:db';
import bcrypt from 'bcryptjs';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if admin user already exists
    const existingAdmin = await db.select().from(AdminUsers).limit(1);

    if (existingAdmin.length > 0) {
      return new Response(JSON.stringify({
        message: 'Admin user already exists',
        username: existingAdmin[0].username
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create default admin user
    const defaultPassword = 'admin123';
    const passwordHash = await bcrypt.hash(defaultPassword, 12);

    const adminData = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      passwordHash: passwordHash,
      isActive: true,
      createdAt: new Date(),
      lastLogin: null,
    };

    await db.insert(AdminUsers).values(adminData);

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin user created successfully',
      username: 'admin',
      password: defaultPassword
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create admin user',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};