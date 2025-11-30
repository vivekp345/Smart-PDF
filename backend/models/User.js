import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function() {
        // Password is only required if googleId is NOT present
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      // unique: true, // Optional: ensure Google IDs are unique if set
    },
  },
  {
    timestamps: true,
  }
);

// --- Middleware: Hash password before saving ---
userSchema.pre('save', async function (next) {
  // 1. If password is not modified, skip
  if (!this.isModified('password')) {
    return next();
  }

  // 2. SAFETY CHECK: If there is no password (e.g. Google Login), skip hashing
  // This prevents bcrypt from crashing on undefined passwords
  if (!this.password) {
    return next();
  }

  // 3. Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Method: Compare entered password with hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Safety check: if user has no password (Google auth), return false
  if (!this.password) return false;
  
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;