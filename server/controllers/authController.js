import { User } from '../models/User.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { validateLoginInput, validateRegisterInput } from '../utils/validation.js';

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
export const register = async (req, res) => {
  try {
    const { error } = validateRegisterInput(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password, role, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }

    const user = new User({
      username,
      email,
      password,
      role,
      name
    });

    await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      message: 'Registration successful',
      user: user.generateAuthToken(),
      token,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
export const login = async (req, res) => {
  try {
    const { error } = validateLoginInput(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      user: user.generateAuthToken(),
      token,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user / Clear refresh token
// @access  Private
export const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { 
      refreshToken: null 
    });
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route   POST /api/auth/refresh-token
// @desc    Get new access token using refresh token
// @access  Public
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const token = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      token,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};