const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: [true, 'Please provide a role name'],
      unique: true,
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please provide required skills'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
