import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const BaseSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4, 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export default BaseSchema