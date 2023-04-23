
const app = require('../router')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connection = require('../db');
dotenv.config();
//////////////////

function generateAccessToken(username)
{
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '900s' });
}


const authenticateToken=(req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}
//
app.route('/wakeUpCall').get(async (req, res) => {
  res.sendStatus(200);
});

app.route('/authenticate').post(async (req, res) => {
  if(req.body.username == undefined || req.body.username == null)
  {
    res.sendStatus(400)
    return;
  }
  if(req.body.password == undefined || req.body.password == null)
  {
    res.sendStatus(400)
    return;
  }

  if(!req.body.username === process.env.USERNAME) 
  {
      res.sendStatus(401)
      return;
  }

  if(!bcrypt.compareSync(req.body.password, process.env.PASSWORD))
  {
    res.sendStatus(401);
    return;
  }
  const token =
    generateAccessToken({ 
    username: req.body.username,
    password: req.body.password
  });
  var response =
  {
    "token": token
  }
  res.json(response);
});

// app.all("*", authenticateToken)

module.exports = authenticateToken;
