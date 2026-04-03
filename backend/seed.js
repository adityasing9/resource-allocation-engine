/**
 * Database Seed Script
 *
 * Creates sample admin, volunteers, and tasks for demo purposes.
 * Run: node seed.js
 *
 * Default admin credentials:
 *   Email: admin@demo.com
 *   Password: admin123
 *
 * Default volunteer credentials:
 *   Email: alice@demo.com / bob@demo.com / carol@demo.com / dave@demo.com / eve@demo.com
 *   Password: volunteer123
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-resource';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ─── Create Admin ────────────────────────────────────
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin',
      skills: [],
      location: { lat: 28.6139, lng: 77.2090 } // New Delhi
    });
    console.log('👤 Admin created: admin@demo.com / admin123');

    // ─── Create Volunteers ───────────────────────────────
    const volunteers = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@demo.com',
        password: 'volunteer123',
        role: 'volunteer',
        skills: ['First Aid', 'Driving', 'Communication'],
        location: { lat: 28.6200, lng: 77.2100 }, // ~1km from center
        availability: true
      },
      {
        name: 'Bob Smith',
        email: 'bob@demo.com',
        password: 'volunteer123',
        role: 'volunteer',
        skills: ['Construction', 'Heavy Lifting', 'Driving'],
        location: { lat: 28.6350, lng: 77.2250 }, // ~3km
        availability: true
      },
      {
        name: 'Carol Williams',
        email: 'carol@demo.com',
        password: 'volunteer123',
        role: 'volunteer',
        skills: ['Medical', 'First Aid', 'Counseling'],
        location: { lat: 28.5900, lng: 77.1900 }, // ~4km
        availability: true
      },
      {
        name: 'Dave Brown',
        email: 'dave@demo.com',
        password: 'volunteer123',
        role: 'volunteer',
        skills: ['Cooking', 'Logistics', 'Communication'],
        location: { lat: 28.6500, lng: 77.2300 }, // ~5km
        availability: false // Unavailable
      },
      {
        name: 'Eve Davis',
        email: 'eve@demo.com',
        password: 'volunteer123',
        role: 'volunteer',
        skills: ['IT Support', 'Communication', 'Data Entry'],
        location: { lat: 28.6100, lng: 77.2300 }, // ~2km
        availability: true
      }
    ]);
    console.log(`👥 ${volunteers.length} volunteers created`);

    // ─── Create Tasks ────────────────────────────────────
    const tasks = await Task.create([
      {
        title: 'Emergency Medical Camp Setup',
        description: 'Set up a medical camp at the community center. Need someone with first aid and medical knowledge.',
        location: { lat: 28.6180, lng: 77.2150 },
        requiredSkills: ['First Aid', 'Medical'],
        urgency: 'High',
        status: 'open',
        createdBy: admin._id
      },
      {
        title: 'Supply Distribution Drive',
        description: 'Distribute emergency supplies to affected families in the area. Requires driving and logistics skills.',
        location: { lat: 28.6250, lng: 77.2200 },
        requiredSkills: ['Driving', 'Logistics'],
        urgency: 'High',
        status: 'open',
        createdBy: admin._id
      },
      {
        title: 'Community Communication Hub',
        description: 'Man the communication hub to coordinate between teams. Good communication skills needed.',
        location: { lat: 28.6100, lng: 77.2050 },
        requiredSkills: ['Communication'],
        urgency: 'Medium',
        status: 'open',
        createdBy: admin._id
      },
      {
        title: 'Shelter Construction Assistance',
        description: 'Help build temporary shelters. Construction and heavy lifting experience required.',
        location: { lat: 28.6400, lng: 77.2100 },
        requiredSkills: ['Construction', 'Heavy Lifting'],
        urgency: 'Medium',
        status: 'open',
        createdBy: admin._id
      },
      {
        title: 'IT Systems Setup',
        description: 'Set up computers and internet connectivity at the relief center.',
        location: { lat: 28.6050, lng: 77.2250 },
        requiredSkills: ['IT Support', 'Data Entry'],
        urgency: 'Low',
        status: 'open',
        createdBy: admin._id
      },
      {
        title: 'Food Preparation Center',
        description: 'Prepare and distribute meals for displaced families. Cooking and logistics skills needed.',
        location: { lat: 28.6300, lng: 77.2000 },
        requiredSkills: ['Cooking', 'Logistics'],
        urgency: 'High',
        status: 'open',
        createdBy: admin._id
      }
    ]);
    console.log(`📋 ${tasks.length} tasks created`);

    console.log('\n🌟 Seed completed successfully!');
    console.log('─────────────────────────────────');
    console.log('Admin Login:     admin@demo.com / admin123');
    console.log('Volunteer Login: alice@demo.com / volunteer123');
    console.log('                 bob@demo.com   / volunteer123');
    console.log('                 carol@demo.com / volunteer123');
    console.log('                 dave@demo.com  / volunteer123');
    console.log('                 eve@demo.com   / volunteer123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
