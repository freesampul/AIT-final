import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AccountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: /.+@.+\..+/,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual password field for setting plain text passwords
AccountSchema.virtual("password")
  .set(function setPassword(plainPassword) {
    this._password = plainPassword;
  })
  .get(function getPassword() {
    return this._password;
  });

// Hash password if virtual password is set
AccountSchema.pre("save", async function hashPasswordIfNeeded(next) {
  try {
    if (this._password) {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      this.passwordHash = await bcrypt.hash(this._password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

AccountSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

const Account = mongoose.model("Account", AccountSchema);
export default Account;


