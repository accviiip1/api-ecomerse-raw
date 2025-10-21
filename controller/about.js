import About from '../models/About.js'

export const listAbout = async (req, res) => {
  try {
    const items = await About.find({ deletedAt: null }).sort({ createdAt: -1 })
    res.json(items)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const getAbout = async (req, res) => {
  try {
    const doc = await About.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const createAbout = async (req, res) => {
  try {
    const doc = await About.create(req.body)
    res.status(201).json(doc)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const updateAbout = async (req, res) => {
  try {
    const doc = await About.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json(doc)
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

export const deleteAbout = async (req, res) => {
  try {
    const doc = await About.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Deleted' })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}


