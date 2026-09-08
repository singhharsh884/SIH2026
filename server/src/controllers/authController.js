import jwt from 'jsonwebtoken';
import { UserModel, memoryStore } from '../models/User.js';
import { isConnectedToMongo } from '../config/db.js';

// Helper to sign JWT token
const signToken = (id, role, rememberMe = false) => {
  const expiresIn = rememberMe ? '30d' : process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'kisandirect_jwt_secret_super_secure_key_2026_!#@',
    { expiresIn }
  );
};

// Helper for role redirection paths
export const getRoleRedirectUrl = (role) => {
  switch (role) {
    case 'farmer':
      return '/farmer/dashboard';
    case 'consumer':
      return '/marketplace';
    case 'buyer':
      return '/buyer/dashboard';
    default:
      return '/marketplace';
  }
};

/**
 * @desc    Register a new user (Farmer, Consumer, or Bulk Buyer)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const {
      role,
      name,
      mobile,
      email,
      password,
      farmName,
      deliveryLocation,
      businessName,
      contactPerson,
      businessType,
      location,
    } = req.body;

    // Validate role
    if (!role || !['farmer', 'consumer', 'buyer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role is required (farmer, consumer, or buyer)',
      });
    }

    // Validate mobile
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile.trim().replace(/\D/g, '').slice(-10))) {
      return res.status(400).json({
        success: false,
        message: 'A valid 10-digit Indian mobile number is required',
      });
    }

    const cleanMobile = mobile.trim().replace(/\D/g, '').slice(-10);
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    // Check if user already exists
    const query = {
      $or: [{ mobile: cleanMobile }],
    };
    if (cleanEmail) {
      query.$or.push({ email: cleanEmail });
    }

    let existingUser;
    if (isConnectedToMongo) {
      existingUser = await UserModel.findOne(query);
    } else {
      existingUser = await memoryStore.findOne(query);
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this mobile number or email already exists. Please login instead.',
      });
    }

    // Prepare role-specific user payload
    const userPayload = {
      role,
      mobile: cleanMobile,
      email: cleanEmail,
      password,
      name: name || contactPerson || businessName,
      location: location || '',
      farmName: farmName || '',
      deliveryLocation: deliveryLocation || '',
      businessName: businessName || '',
      contactPerson: contactPerson || '',
      businessType: businessType || '',
      badge:
        role === 'farmer'
          ? 'Registered Farmer'
          : role === 'buyer'
          ? 'Registered Bulk Buyer'
          : 'Registered Consumer',
    };

    let newUser;
    if (isConnectedToMongo) {
      newUser = await UserModel.create(userPayload);
    } else {
      newUser = await memoryStore.create(userPayload);
    }

    const token = signToken(newUser._id, newUser.role, false);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser._id,
        role: newUser.role,
        name: newUser.name,
        mobile: newUser.mobile,
        email: newUser.email,
        businessName: newUser.businessName || newUser.farmName,
        location: newUser.location || newUser.deliveryLocation,
        badge: newUser.badge,
      },
      redirectUrl: getRoleRedirectUrl(newUser.role),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user with mobile/email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { identifier, password, role, rememberMe } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both mobile/email and password',
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const isEmail = cleanIdentifier.includes('@');
    const cleanMobile = cleanIdentifier.replace(/\D/g, '').slice(-10);

    // Search query
    const query = isEmail
      ? { email: cleanIdentifier }
      : { mobile: cleanMobile };

    let user;
    if (isConnectedToMongo) {
      user = await UserModel.findOne(query);
    } else {
      user = await memoryStore.findOne(query);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this mobile number or email.',
      });
    }

    // Role check
    if (role && user.role !== role) {
      const roleLabel =
        user.role === 'farmer'
          ? 'Farmer / FPO'
          : user.role === 'buyer'
          ? 'Bulk Buyer'
          : 'Consumer';
      return res.status(400).json({
        success: false,
        message: `This account is registered as a ${roleLabel}. Please switch role above to login.`,
      });
    }

    // Password verification using bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your password.',
      });
    }

    const token = signToken(user._id, user.role, rememberMe);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        businessName: user.businessName || user.farmName,
        location: user.location || user.deliveryLocation,
        badge: user.badge || 'Verified Account',
      },
      role: user.role,
      redirectUrl: getRoleRedirectUrl(user.role),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        businessName: user.businessName || user.farmName,
        location: user.location || user.deliveryLocation,
        badge: user.badge,
      },
      role: user.role,
      redirectUrl: getRoleRedirectUrl(user.role),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Simulate Forgot Password OTP Request
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered mobile number or email',
      });
    }

    res.status(200).json({
      success: true,
      message: `Password reset OTP has been dispatched to ${identifier}. Valid for 10 minutes.`,
    });
  } catch (error) {
    next(error);
  }
};
