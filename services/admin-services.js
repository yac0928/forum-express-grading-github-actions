const { Restaurant, Category, User } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getRestaurants: (req, cb) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        return cb(null, { restaurants })
      })
      .catch(err => cb(err))
  },
  createRestaurant: (req, cb) => {
    return Category.findAll({ raw: true })
      .then(categories => cb(null, { categories }))
      .catch(err => cb(err))
  },
  postRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    return localFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        imgae: filePath || null,
        categoryId
      }))
      .then(newRestaurant => {
        cb(null, { restaurant: newRestaurant })
      })
      .catch(err => cb(err))
  },
  getRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('Restaurant didn\'t exist')
        cb(null, { restaurant })
      })
      .catch(err => cb(err))
  },
  editRestaurant: (req, cb) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error('Restaurant didn\'t exist')
        cb(null, { restaurant, categories })
      })
      .catch(err => cb(err))
  },
  putRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required')
    const { file } = req
    return Promise.all([
      Restaurant.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error('Restaurant didn\'t exist')
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(putRestaurant => {
        cb(null, { restaurant: putRestaurant })
      })
      .catch(err => cb(err))
  },
  deleteRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error('Restaurant didn\'t exist')
          err.status = 404
          throw err
        }
        return restaurant.destroy()
      })
      .then(deletedRestaurant => {
        cb(null, { deletedRestaurant })
      })
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    return User.findAll({ raw: true })
      .then(users => cb(null, { users }))
      .catch(err => cb(err))
  },
  patchUser: (req, cb) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('User didn\'t exist')
        if (user.email === 'root@example.com') throw new Error('禁止變更 root 權限')
        return user.update({ isAdmin: !user.isAdmin })
      })
      .then(updatedUser => {
        const userData = updatedUser.toJSON()
        delete userData.password
        cb(null, { user: userData })
      })
      .catch(err => cb(err))
  }
}

module.exports = adminServices
