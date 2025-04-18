const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['Admin', 'Owner', 'Manager', 'Cashier', 'TELLYCALLER', 'Storekeeper', 'Staff', 'Workshop'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: false,
      default: '',
      validate: {
        validator: function(v) {
          // Return true if empty (since it's not required) or if it's a 10-digit number
          return v === '' || /^\d{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit mobile number!`
      }
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if entered password matches the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }

  // Generate salt
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
