import Category from '../models/Category.js'

export const listCategories = async (req, res) => {
  try { const items = await Category.find({ deletedAt: null }).sort({ createdAt: -1 }); res.json(items) } catch (e) { res.status(500).json({ message: e.message }) }
}
export const createCategory = async (req, res) => {
  try { const doc = await Category.create(req.body); res.status(201).json(doc) } catch (e) { res.status(500).json({ message: e.message }) }
}
export const updateCategory = async (req, res) => {
  try { const doc = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!doc) return res.status(404).json({ message: 'Not found' }); res.json(doc) } catch (e) { res.status(500).json({ message: e.message }) }
}
export const deleteCategory = async (req, res) => {
  try { const doc = await Category.findByIdAndDelete(req.params.id); if (!doc) return res.status(404).json({ message: 'Not found' }); res.json({ message: 'Deleted' }) } catch (e) { res.status(500).json({ message: e.message }) }
}


