const app = require('../router')
var mongoUtil = require( '../db' );
const { ObjectId } = require('mongodb');
const authenticate = require("./Authenticate")

app.route('/Visitors').get(authenticate,async (req, res) => {
    await mongoUtil.connectToServer();
    const db = mongoUtil.getDb();
    const collection = db.collection('portfolioVisitors');
    const result = await collection.find().toArray();
    if(result.length == 0)
    {
        res.send([])
        return;
    }
    res.json(result)
});

app.route('/Visitors').post(async (req, res) => {
    try {
        await mongoUtil.connectToServer();
        const db = mongoUtil.getDb();
        const visitorsCollection = db.collection('portfolioVisitors');
        const whitelistCollection = db.collection('portfolioVisitorsWhitelist');
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
        const arr = ip.split(",");
        const ipfinal = arr.splice(0,1).join("");

        // Check if visitor is in the whitelist
        const isWhitelisted = await whitelistCollection.findOne({ ip: ipfinal });
        if (isWhitelisted) {
            return res.json(null); // Visitor is already in the whitelist
        }

        const visitor = {
        _id: new ObjectId(),
        "visitorIp": ipfinal,
        "date": new Date()
        }

        const result = await visitorsCollection.insertOne(visitor);
        if (result && result.insertedId !== undefined && result.insertedId !== null) {
        const insertedVisitor = await visitorsCollection.findOne({ _id: result.insertedId });
        res.json(visitor);
        } else {
        res.status(500).send('Failed to insert visitor');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.route('/Visitors/:id').delete(authenticate,async (req, res) => {
    try {
      await mongoUtil.connectToServer();
      const db = mongoUtil.getDb();
      const collection = db.collection('portfolioVisitors');
  
      const id = req.params.id;
  
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        res.json({ message: `Visitor with ID ${id} deleted successfully` });
      } else {
        res.status(404).send('Visitor not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});
  
  

app.route('/VisitorsWhitelist').get(authenticate,async (req, res) => {
    try {
      await mongoUtil.connectToServer();
      const db = mongoUtil.getDb();
      const collection = db.collection('portfolioVisitorsWhitelist');
  
      const whitelist = await collection.find().toArray();
  
      res.json(whitelist);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

app.route('/VisitorsWhitelist').post(authenticate,async (req, res) => {
    try {
      await mongoUtil.connectToServer();
      const db = mongoUtil.getDb();
      const collection = db.collection('portfolioVisitorsWhitelist');

      const whitelist = {
        _id: new ObjectId(),
        "ip": req.body.ip
      }

      const result = await collection.insertOne(whitelist);
      if (result && result.insertedId !== undefined && result.insertedId !== null) {
        const insertedComment = await collection.findOne({ _id: result.insertedId });
        res.json(whitelist);
      } else {
        res.status(500).send('Failed to insert comment');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.route('/VisitorsWhitelist/:id').delete(authenticate,async (req, res) => {
    try {
      await mongoUtil.connectToServer();
      const db = mongoUtil.getDb();
      const collection = db.collection('portfolioVisitorsWhitelist');
  
      const id = new ObjectId(req.params.id);
  
      const result = await collection.deleteOne({ _id: id });
      if (result.deletedCount === 1) {
        res.json({ message: `Whitelist entry with _id ${id} deleted successfully` });
      } else {
        res.status(404).send('Whitelist entry not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});
  