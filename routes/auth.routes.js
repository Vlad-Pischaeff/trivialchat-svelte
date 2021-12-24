const {Router} = require('express')
const router = Router()

const config = require('config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

const auth = require('../middleware/auth.middleware')
const User = require('../models/User')
const SECRET = config.get("jwtSecret")
const manager = require('./helper');

// /api/auth/register
router.post('/register', 
  [
    check('email', 'Uncorrect email ...').isEmail(),
    check('password', 'Uncorrect password length, min 6 symbols ...').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(412).json({ ...errors.array() })
      }

      const { email, password } = req.body
      const candidate = await User.findOne({ email })

      if (candidate) {
        return res.status(400).json({message:`User email ${email} is already exists...`})
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })
      
      await user.save((err, doc) => {
        if (err) {
          console.error('CREATE USER ERROR ...', err) 
          return res.status(500).json({message:`User ${email} not created...`})
        } else {
          const token = jwt.sign( { userId: doc.id }, SECRET, { expiresIn: '10h' } )
          res.status(201).json({ ...doc._doc, token })
        }
      })
    } catch (e) {
      console.log('Register error...', e)
      res.status(500).json({message:`Something wrong while user ${email} registration...`})
    }
  }
)

// /api/auth/login
router.post('/login', 
  [
    check('email', 'Uncorrect email ...').isEmail()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(412).json({ ...errors.array() })
      }

      const { email, password } = req.body
      const candidate = await User.findOne({ email })

      if (!candidate) {
        return res.status(400).json({ message:`User ${email} not found...` })
      }

      const isMatch = await bcrypt.compare( password, candidate.password )
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Wrong password...' })
      }

      const token = jwt.sign( { userId: candidate.id }, SECRET, { expiresIn: '10h' } )

      res.status(201).json({...candidate._doc, token })
    } catch (e) {
      res.status(500).json({ message:`Something wrong ${e}...` })
    }
  }
)

// get user information
router.get('/user/:id', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
    res.status(201).json(user)
  } catch(e) {
    res.status(500).json({ message:`Something wrong ..., details ${e}` })
  }
})

// get user's site information
router.get('/usersite/:id', async (req, res) => {
  try {
    const user = await User.findOne({ site: req.params.id })
    // const site
    console.log('auth routes req...', req.headers.referer, req.headers.host)
    if (user) {
      res.status(201).json({ avatar: user.avatar, title: user.title, desc: user.desc, greeting: user.greeting })
    } else {
      res.status(401).json({ message: 'NO SUCH USER' })
    }
  } catch(e) {
    res.status(500).json({ message:`Something wrong ..., details ${e}` })
  }
})

// update user information
router.patch('/user/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { site } = req.body

    if (site) {
      const newSite = await User.findOne({ site: site, _id: { $ne: id}})
      if (newSite) {
        return res.status(400).json({ message:`Site ${site} is already in use...` })
      }
    }

    const user = await User.findByIdAndUpdate(id, req.body)
    const newUser = await User.findOne({ _id: id })
    res.status(201).json(newUser)

    manager.getUsers();

  } catch(e) {
    res.status(500).json({ message:`Something wrong ..., details ${e}` })
  }
})

module.exports = router