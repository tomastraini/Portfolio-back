
const app = require('../router')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const mongoUtil = require('../db');
dotenv.config();
//////////////////

function generateAccessToken(username)
{
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '900s' });
}


const authenticateToken = async (req, res, next) => {
  try {
    await mongoUtil.connectToServer()
    const db = mongoUtil.getDb()
    const whitelistCollection = db.collection('portfolioVisitorsWhitelist')

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null
    const arr = ip.split(",")
    const ipfinal = arr.splice(0,1).join("")
    
    // Check if visitor is in the whitelist
    const isWhitelisted = await whitelistCollection.findOne({ ip: ipfinal });
    if (isWhitelisted) {
        return next(); // Visitor is already in the whitelist, allow access without a token
    }
    
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)

      req.user = user

      next()
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
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
