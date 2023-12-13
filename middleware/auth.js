const helpers = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  req.flash('error_messages', '尚未登入')
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()
    req.flash('error_messages', '權限不足')
    // 這裡如果redirect'/'，會再redirect到'/restaurants/，flash僅會在'/'出現，故須直接導向'/restaurants'
    res.redirect('/restaurants')
  } else {
    req.flash('error_messages', '尚未登入')
    res.redirect('/signin')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
