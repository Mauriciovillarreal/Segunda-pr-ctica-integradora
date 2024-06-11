const express = require('express')
const passport = require('passport')
const  { auth } = require('../../middlewares/auth.middleware.js')
const { usersModel } = require('../../models/users.model.js')

const sessionsRouter = express.Router()

sessionsRouter.get('/github',
  passport.authenticate('github', { scope: 'user:email' }), async (req, res) => { })


sessionsRouter.get('/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    req.session.user = req.user
    res.redirect('/')
  })

sessionsRouter.get('/current', auth, async (req, res)  => {
  try {
    const user = await usersModel.findById(req.session.user._id)
    res.json(user)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario actual' })
  }
})

sessionsRouter.post('/login', (req, res, next) => {
  passport.authenticate('login', (error, user, info) => {
    if (error) {
      return next(error)
    }
    if (!user) {
      req.session.error = 'Email or password incorrect'
      return res.redirect('/login')
    }
    req.logIn(user, (error) => {
      if (error) {
        return next(error)
      }
      return res.redirect('/')
    })
  })(req, res, next)
})

sessionsRouter.post('/register', (req, res, next) => {
  passport.authenticate('register', (error, user, info) => {
    if (error) {
      return next(error)
    }
    if (!user) {
      req.session.error = 'Error registering user'
      return res.redirect('/register')
    }
    req.logIn(user, (error) => {
      if (error) {
        return next(error)
      }
      return res.redirect('/login')
    })
  })(req, res, next)
})

sessionsRouter.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) return res.send({ status: 'error', error: error })
    else return res.redirect("/login")
  })
})

module.exports = sessionsRouter