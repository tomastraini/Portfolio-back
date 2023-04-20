// IMPORTS
const express = require('express');
const bodyParser = require('body-parser');
var router = express.Router({mergeParams: true});
//////////////////
const app = express();
const port = process.env.PORT || 1002;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api', router)
  
app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`);
});

module.exports = router
