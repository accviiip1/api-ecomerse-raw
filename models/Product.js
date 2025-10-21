import mongoose from "mongoose";
import BaseSchema from "./Base.js";

const ProductSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true
 },
 price: {
    type: Number,
    required: true
 },
 description: {
    type: String,
    required: true
 },
 type: {
    type: String,
    required: true
 },
 categoryId: {
    type: String,
    default: null
 },
 brandId: {
    type: String,
    default: null
 },
 size: {
    type: [Object],
    required: true
 },
 material: {
    type: String,
    required: true
 },
 images: {
    type: [String],
    required: true
 },
 visible: {
    type: Boolean,
    default: true
 }
})

ProductSchema.add(BaseSchema)

export default mongoose.model("Product", ProductSchema)