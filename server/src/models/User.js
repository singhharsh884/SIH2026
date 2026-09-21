import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, 'User role is required'],
      enum: {
        values: ['farmer', 'consumer', 'buyer', 'fpo'],
        message: '{VALUE} is not a valid role. Choose farmer, consumer, buyer, or fpo',
      },
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },

    // Role-specific fields: Farmer / FPO
    farmName: {
      type: String,
      trim: true,
      default: '',
    },
    fpoName: {
      type: String,
      trim: true,
      default: '',
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: '',
    },
    memberFarmersCount: {
      type: Number,
      default: 0,
    },

    // Role-specific fields: Consumer
    deliveryLocation: {
      type: String,
      trim: true,
      default: '',
    },

    // Role-specific fields: Bulk Buyer
    businessName: {
      type: String,
      trim: true,
      default: '',
    },
    contactPerson: {
      type: String,
      trim: true,
      default: '',
    },
    businessType: {
      type: String,
      trim: true,
      default: '',
    },

    // Shared location for Farmer & Bulk Buyer
    location: {
      type: String,
      trim: true,
      default: '',
    },

    badge: {
      type: String,
      default: 'Verified Member',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: Hash password with bcrypt before saving to MongoDB
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method: Verify candidate password against hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields when serializing to JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export const UserModel = mongoose.model('User', UserSchema);

/**
 * In-memory resilient store for when local MongoDB daemon isn't running
 */
class MemoryUserStore {
  constructor() {
    this.users = [];
    this.seedDemoUsersSync();
  }

  seedDemoUsersSync() {
    const makeUser = (id, role, name, mobile, email, plainPass, extra = {}) => {
      const hashedPassword = bcrypt.hashSync(plainPass, 10);
      return {
        _id: id,
        role,
        name,
        mobile,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        ...extra,
        comparePassword: async function (candidatePassword) {
          return bcrypt.compare(candidatePassword, this.password);
        },
        toJSON: function () {
          const copy = { ...this };
          delete copy.password;
          return copy;
        },
      };
    };

    this.users = [
      makeUser('usr_demo_farmer', 'farmer', 'Rameshwar Patel', '9876543210', 'farmer@kisandirect.in', 'farmer@123', {
        farmName: 'Krishi Vikas Organic FPO, Nashik',
        location: 'Nashik, Maharashtra',
        badge: 'Verified Organic FPO (45+ member farmers)',
      }),
      makeUser('usr_demo_consumer', 'consumer', 'Ananya Sharma', '9811223344', 'ananya.sharma@gmail.com', 'fresh@123', {
        deliveryLocation: 'Indiranagar, Bengaluru - 560038',
        badge: 'Premium Household Buyer',
      }),
      makeUser('usr_demo_buyer', 'buyer', 'Rajiv Mehra', '9988776655', 'procurement@tastygreens.com', 'buyer@123', {
        businessName: 'TastyGreens Restaurant Chain & Retail',
        contactPerson: 'Rajiv Mehra',
        businessType: 'Restaurant / Hotel Chain',
        location: 'Mumbai Central, Maharashtra',
        badge: 'Bulk Institutional Buyer (5+ Tons/week)',
      }),
    ];
  }

  async findOne(query) {
    return this.users.find((u) => {
      for (const key of Object.keys(query)) {
        if (key === '$or') {
          return query.$or.some((sub) => {
            const subKey = Object.keys(sub)[0];
            return u[subKey]?.toLowerCase() === sub[subKey]?.toLowerCase();
          });
        }
        if (u[key]?.toString().toLowerCase() !== query[key]?.toString().toLowerCase()) {
          return false;
        }
      }
      return true;
    });
  }

  async findById(id) {
    return this.users.find((u) => u._id === id);
  }

  async create(data) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = {
      _id: 'usr_' + Date.now(),
      ...data,
      password: hashedPassword,
      createdAt: new Date(),
      comparePassword: async function (pass) {
        return await bcrypt.compare(pass, this.password);
      },
      toJSON: function () {
        const copy = { ...this };
        delete copy.password;
        return copy;
      },
    };

    this.users.push(newUser);
    return newUser;
  }
}

export const memoryStore = new MemoryUserStore();
