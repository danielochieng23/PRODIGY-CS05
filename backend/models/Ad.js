const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Ad title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    url: String,
    publicId: String, // For Cloudinary
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  price: {
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    type: {
      type: String,
      enum: ['fixed', 'negotiable', 'free'],
      default: 'negotiable'
    }
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      default: 'India'
    },
    area: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    whatsapp: String,
    email: String,
    showPhone: {
      type: Boolean,
      default: true
    },
    showEmail: {
      type: Boolean,
      default: false
    }
  },
  features: {
    age: Number,
    height: String,
    weight: String,
    availability: {
      type: String,
      enum: ['24/7', 'daytime', 'evening', 'weekend', 'appointment'],
      default: 'appointment'
    },
    services: [String],
    languages: [String]
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired', 'suspended', 'deleted'],
    default: 'pending'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  lastRenewed: {
    type: Date,
    default: Date.now
  },
  tags: [String],
  reportCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
adSchema.index({ title: 'text', description: 'text', tags: 'text' });
adSchema.index({ 'location.city': 1, category: 1 });
adSchema.index({ user: 1 });
adSchema.index({ status: 1, expiresAt: 1 });

// Update ads count in category when ad is saved
adSchema.post('save', async function() {
  const Category = mongoose.model('Category');
  await Category.findByIdAndUpdate(this.category, {
    $inc: { adsCount: 1 }
  });
});

// Update ads count in category when ad is removed
adSchema.post('remove', async function() {
  const Category = mongoose.model('Category');
  await Category.findByIdAndUpdate(this.category, {
    $inc: { adsCount: -1 }
  });
});

module.exports = mongoose.model('Ad', adSchema);