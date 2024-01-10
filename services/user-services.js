const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const userServices = {
  signUp: (req, cb) => {
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
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.id, {
      include: { model: Comment, include: Restaurant }
    })
      .then(user => {
        if (!user) throw new Error('User didn\'t exist')
        user = user.toJSON()
        console.log(user.Comments[0].Restaurant)
        user.commentedRestaurants = user.Comments && user.Comments.reduce((acc, c) => {
          if (!acc.some(r => r.id === c.restaurantId)) {
            acc.push(c.Restaurant)
          }
          return acc
        }, [])
        cb(null, user)
      // 傳入的名稱不能取名為user，否則req.locals.user會被覆蓋，header的部分會出錯。後來我把locals名稱改掉，為了符合test。
      })
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const paramId = Number(req.params.id)
    const userId = Number(req.user.id)
    if (paramId !== userId) throw new Error('Permission denied!')
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
      .then(updatedUser => cb(null, updatedUser))
      .catch(err => cb(err))
  },
  addFavorite: (req, cb) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        if (favorite) throw new Error('You have favorited this restaurant!')
        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(newFavorite => cb(null, newFavorite))
      .catch(err => cb(err))
  },
  removeFavorite: (req, cb) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(deletedFavorite => cb(null, deletedFavorite))
      .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) throw new Error('Restaurant didn\'t exist!')
        if (like) throw new Error('You have already liked this restaurant!')
        return Like.create({
          userId: req.user.id,
          restaurantId
        })
      })
      .then(newLike => cb(null, newLike))
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        if (!like) throw new Error('You haven\'t liked this restaurant!')
        return like.destroy()
      })
      .then(deletedLike => cb(null, deletedLike))
      .catch(err => cb(err))
  },
  getTopUsers: (req, cb) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        cb(null, { users: result })
      })
      .catch(err => cb(err))
  },
  addFollowing: (req, cb) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(newFollowship => cb(null, newFollowship))
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(deletedFollowship => cb(null, deletedFollowship))
      .catch(err => cb(err))
  }
}

module.exports = userServices
