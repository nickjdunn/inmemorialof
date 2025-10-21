const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const { protect } = require('../middleware/auth');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      email,
      name,
      password: password || undefined,
      emailVerificationToken: verificationToken
    });

    // Try to send email, but don't fail if it doesn't work (for development)
    try {
      await sendEmail({
        to: email,
        subject: 'Verify your email',
        template: 'email-verification',
        data: {
          name,
          verificationLink: `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
        }
      });
    } catch (emailError) {
      console.log('Email not sent (this is OK for development):', emailError.message);
    }

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      requiresVerification: true,
      // For development only - remove in production
      devNote: 'Email may not be sent. Check console for verification token.',
      verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    const authToken = generateToken(user._id);

    res.json({
      message: 'Email verified successfully',
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Server error during verification' });
  }
});

// @route   POST /api/auth/magic-link
// @desc    Send magic link for passwordless login
// @access  Public
router.post('/magic-link', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, accountStatus: 'active' });
    if (!user) {
      return res.json({ message: 'If account exists, magic link has been sent' });
    }

    const magicToken = crypto.randomBytes(32).toString('hex');
    const maxUses = parseInt(process.env.MAGIC_LINK_MAX_USES) || 3;
    const expiresIn = parseInt(process.env.MAGIC_LINK_EXPIRE) || 900000;

    user.magicLinkToken = magicToken;
    user.magicLinkExpires = new Date(Date.now() + expiresIn);
    user.magicLinkUses = 0;
    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: 'Your login link',
        template: 'magic-link',
        data: {
          name: user.name,
          magicLink: `${process.env.FRONTEND_URL}/auth/magic/${magicToken}`,
          expiresIn: Math.floor(expiresIn / 60000),
          maxUses
        }
      });
    } catch (emailError) {
      console.log('Email not sent (this is OK for development):', emailError.message);
    }

    res.json({ 
      message: 'If account exists, magic link has been sent',
      // For development only
      devNote: 'Email may not be sent. Check console for magic token.',
      magicToken: process.env.NODE_ENV === 'development' ? magicToken : undefined
    });
  } catch (error) {
    console.error('Magic link error:', error);
    res.status(500).json({ error: 'Server error sending magic link' });
  }
});

// @route   POST /api/auth/magic-login
// @desc    Login with magic link
// @access  Public
router.post('/magic-login', async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      magicLinkToken: token,
      magicLinkExpires: { $gt: Date.now() },
      accountStatus: 'active'
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired magic link' });
    }

    const maxUses = parseInt(process.env.MAGIC_LINK_MAX_USES) || 3;
    if (user.magicLinkUses >= maxUses) {
      return res.status(400).json({ error: 'Magic link has been used too many times' });
    }

    user.magicLinkUses += 1;
    if (user.magicLinkUses >= maxUses) {
      user.magicLinkToken = undefined;
      user.magicLinkExpires = undefined;
    }
    user.lastLogin = new Date();
    await user.save();

    const authToken = generateToken(user._id);

    res.json({
      token: authToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        memorialSlots: user.memorialSlots
      }
    });
  } catch (error) {
    console.error('Magic login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   POST /api/auth/login
// @desc    Login with password
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, accountStatus: 'active' }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(400).json({ 
        error: 'This account uses passwordless login. Please request a magic link.' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.emailVerified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        memorialSlots: user.memorialSlots
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, accountStatus: 'active' });
    if (!user) {
      return res.json({ message: 'If account exists, password reset email has been sent' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset Request',
        template: 'password-reset',
        data: {
          name: user.name,
          resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        }
      });
    } catch (emailError) {
      console.log('Email not sent (this is OK for development):', emailError.message);
    }

    res.json({ message: 'If account exists, password reset email has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error sending reset email' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error resetting password' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal mainly)
// @access  Private
router.post('/logout', protect, async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    
    if (user.password) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error changing password' });
  }
});

// @route   POST /api/auth/change-email
// @desc    Request email change (sends confirmation to old email)
// @access  Private
router.post('/change-email', protect, async (req, res) => {
  try {
    const { newEmail } = req.body;

    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const confirmToken = crypto.randomBytes(32).toString('hex');
    
    req.user.pendingEmailChange = {
      newEmail,
      token: confirmToken,
      expiresAt: Date.now() + 3600000
    };
    await req.user.save();

    try {
      await sendEmail({
        to: req.user.email,
        subject: 'Confirm Email Change',
        template: 'email-change-confirmation',
        data: {
          name: req.user.name,
          newEmail,
          confirmLink: `${process.env.FRONTEND_URL}/confirm-email-change/${confirmToken}`
        }
      });
    } catch (emailError) {
      console.log('Email not sent (this is OK for development):', emailError.message);
    }

    res.json({ message: 'Confirmation email sent to your current email address' });
  } catch (error) {
    console.error('Email change error:', error);
    res.status(500).json({ error: 'Server error requesting email change' });
  }
});

module.exports = router;