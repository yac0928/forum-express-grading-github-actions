const commentServices = require('../../services/comment-services')

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'The comment was successfully created')
      req.session.createdData = data
      return res.redirect(`/restaurants/${data.restaurantId}`)
    })
  },
  deleteComment: (req, res, next) => {
    commentServices.deleteComment(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'The comment was successfully deleted')
      req.session.deletedData = data
      return res.redirect(`/restaurants/${data.restaurantId}`)
    })
  }
}
module.exports = commentController
