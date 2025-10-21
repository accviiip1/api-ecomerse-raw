import mongoose from "mongoose";
import bcrypt from "bcrypt";
import BaseSchema from "./Base.js";

const UserSchema = new mongoose.Schema({
    // legacy
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    // new schema fields (compat)
    name: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, index: true, unique: false },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['user','admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
});

UserSchema.pre("save", async function (next) {
    if(this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
});

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

UserSchema.add(BaseSchema)

export default mongoose.model("User", UserSchema);

