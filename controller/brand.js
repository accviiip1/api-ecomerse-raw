import Brand from '../models/Brand.js'

export const listBrands = async (req, res) => {
  try { const items = await Brand.find({ deletedAt: null }).sort({ createdAt: -1 }); res.json(items) } catch (e) { res.status(500).json({ message: e.message }) }
}
export const createBrand = async (req, res) => {
  try { const doc = await Brand.create(req.body); res.status(201).json(doc) } catch (e) { res.status(500).json({ message: e.message }) }
}
export const updateBrand = async (req, res) => {
  try { const doc = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!doc) return res.status(404).json({ message: 'Not found' }); res.json(doc) } catch (e) { res.status(500).json({ message: e.message }) }
}
export const deleteBrand = async (req, res) => {
  try { const doc = await Brand.findByIdAndDelete(req.params.id); if (!doc) return res.status(404).json({ message: 'Not found' }); res.json({ message: 'Deleted' }) } catch (e) { res.status(500).json({ message: e.message }) }
}


