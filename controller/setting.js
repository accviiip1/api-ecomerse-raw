import Setting from '../models/Setting.js'

export const getSetting = async (req, res) => {
  try {
    console.log('Getting settings...')
    const doc = await Setting.findOne({})
    console.log('Settings found:', doc)
    res.json(doc || {})
  } catch (e) {
    console.error('Error getting settings:', e)
    res.status(500).json({ message: e.message })
  }
}

export const upsertSetting = async (req, res) => {
  try {
    console.log('Received settings data:', req.body)
    
    const update = req.body
    
    // Validate required fields
    if (!update) {
      return res.status(400).json({ message: 'No data provided' })
    }
    
    const doc = await Setting.findOneAndUpdate(
      {}, 
      update, 
      { 
        new: true, 
        upsert: true,
        runValidators: true
      }
    )
    
    console.log('Settings saved successfully:', doc)
    res.json({ 
      success: true, 
      message: 'Settings saved successfully',
      data: doc 
    })
  } catch (e) {
    console.error('Error saving settings:', e)
    res.status(500).json({ 
      success: false,
      message: e.message,
      error: e 
    })
  }
}


