// Main Router
require('./router')

require('./Controllers/Authenticate')

// All routes
require('./Controllers/Comments')
require('./Controllers/Visitors')

// All routes if not up, then 404
require('./Controllers/404Controller')