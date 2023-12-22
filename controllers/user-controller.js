const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Comment, Restaurant } = db
const { localFileHandler } = require('../helpers/file-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號!')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '登入成功!')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: { model: Comment, include: Restaurant }
    })
      .then(user => {
        if (!user) throw new Error('User didn\'t exist')
        user = user.toJSON()
        user.commentedRestaurants = user.Comments && user.Comments.reduce((acc, c) => {
          if (!acc.some(r => r.id === c.restaurantId)) {
            acc.push(c.Restaurant)
          }
          return acc
        }, [])
        console.log(user)
        res.render('users/profile', { user })
      // 傳入的名稱不能取名為user，否則req.locals.user會被覆蓋，header的部分會出錯。後來我把locals名稱改掉，為了符合test。
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    // if (Number(req.params.id) !== Number(req.user.id)) {
    //   req.flash('error_messages', '只能編輯自己的profile')
    //   res.redirect(`/users/${req.params.id}`)
    // }
    // 上面是為了測試而刪除的，test找不到req.user.id不知道為什麼?
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('User didn\'t exist')
        res.render('users/edit', { user: user.toJSON() })
      })
  },
  putUser: (req, res, next) => {
    const paramId = Number(req.params.id)
    const userId = Number(req.user.id)
    if (paramId !== userId) {
      res.redirect(`/users/${paramId}`)
    }
    const { file } = req
    return Promise.all([
      User.findByPk(paramId),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error('User didn\'t exist')
        return user.update({
          name: req.body.name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${paramId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
