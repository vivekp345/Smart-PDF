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
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// --- Mongoose Middleware ---
// Hash password BEFORE saving a new user
userSchema.pre('save', async function (next) {
  // 'this' refers to the user document
  if (!this.isModified('password')) {
    next(); // If password isn't being changed, move on
  }

  // 1. Generate a "salt"
  const salt = await bcrypt.genSalt(10);
  // 2. Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// --- Mongoose Model Method ---
// Add a custom method to the user schema to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the hashed password from the DB
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;