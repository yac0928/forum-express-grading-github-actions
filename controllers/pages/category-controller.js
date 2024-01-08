const categoryServices = require('../../services/category-services')

const categoryController = {
  getCategories: (req, res, next) => {
    categoryServices.getCategories(req, (err, data) => err ? next(err) : res.render('admin/categories', data))
  },
  postCategory: (req, res, next) => {
    categoryServices.postCategory(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'The category was successfully created')
      req.session.createdData = data
      return res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res, next) => {
    categoryServices.putCategory(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'The category was successfully updated')
      req.session.putData = data
      return res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res, next) => {
    categoryServices.deleteCategory(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'The category was successfully deleted')
      req.session.putData = data
      return res.redirect('/admin/categories')
    })
  }
}
module.exports = categoryController
