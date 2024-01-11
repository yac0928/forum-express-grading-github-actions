const { User } = require('../../models')
const userServices = require('../../services/user-services')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功註冊帳號!')
      req.session.createdData = data
      res.redirect('/signin')
    })
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
    userServices.getUser(req, (err, data) => err ? next(err) : res.render('users/profile', data))
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
    userServices.putUser(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '使用者資料編輯成功')
      req.session.putData = data
      res.redirect(`/users/${req.params.id}`)
    })
  },
  addFavorite: (req, res, next) => {
    userServices.addFavorite(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功加入最愛!')
      req.session.createdData = data
      res.redirect('back')
    })
  },
  removeFavorite: (req, res, next) => {
    userServices.removeFavorite(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功移除最愛!')
      req.session.deletedData = data
      res.redirect('back')
    })
  },
  addLike: (req, res, next) => {
    userServices.addLike(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功加入喜歡!')
      req.session.createdData = data
      res.redirect('back')
    })
  },
  removeLike: (req, res, next) => {
    userServices.removeLike(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功移除喜歡!')
      req.session.deletedData = data
      res.redirect('back')
    })
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => err ? next(err) : res.render('top-users', data))
  },
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功追蹤!')
      req.session.createdData = data
      res.redirect('/signin')
    })
  },
  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', '成功移除追蹤!')
      req.session.deletedData = data
      res.redirect('back')
    })
  }
}

module.exports = userController
