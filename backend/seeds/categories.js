const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
  {
    name: 'Escorts',
    description: 'Professional escort services',
    icon: 'escort-icon.png',
    sortOrder: 1
  },
  {
    name: 'Massage',
    description: 'Relaxation and therapeutic massage services',
    icon: 'massage-icon.png',
    sortOrder: 2
  },
  {
    name: 'Adult Services',
    description: 'Various adult entertainment services',
    icon: 'adult-icon.png',
    sortOrder: 3
  },
  {
    name: 'Dating',
    description: 'Dating and companionship services',
    icon: 'dating-icon.png',
    sortOrder: 4
  },
  {
    name: 'Entertainment',
    description: 'Adult entertainment and shows',
    icon: 'entertainment-icon.png',
    sortOrder: 5
  },
  {
    name: 'Therapy',
    description: 'Alternative therapy services',
    icon: 'therapy-icon.png',
    sortOrder: 6
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    await Category.insertMany(categories);
    console.log('Categories seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;