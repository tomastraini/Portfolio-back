const app = require('../router')
var mongoUtil = require( '../db' );
const { ObjectId } = require('mongodb');
const authenticate = require("./Authenticate")

  
app.route('/Comments').get(authenticate,async (req, res) => {
    await mongoUtil.connectToServer();
    const db = mongoUtil.getDb();
    const collection = db.collection('portfolioComments');
    const result = await collection.find().toArray();
    if(result.length == 0)
    {
        res.send([])
        return;
    }
    res.json(result)
});

app.route('/Comments/:id').get(authenticate,async (req, res) => {
    try {
      await mongoUtil.connectToServer();
      const db = mongoUtil.getDb();
      const collection = db.collection('portfolioComments');
      const commentId = req.params.id;
      const objectId = new ObjectId(commentId); // Convert commentId to ObjectId
      const comment = await collection.findOne({ _id: objectId });
      if (comment) {
        res.json(comment);
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.route('/Comments').post(async (req, res) => {
    try {
      await mongoUtil.connectToServer();
      const db = mongoUtil.getDb();
      const collection = db.collection('portfolioComments');
      var ip = req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      null;
      var arr = ip.split(",");
      var ipfinal = arr.splice(0,1).join("");

      const comment = {
        _id: new ObjectId(),
        "comment": req.body.comment,
        "clientIp": ipfinal
      }
      const result = await collection.insertOne(comment);
      if (result && result.insertedId !== undefined && result.insertedId !== null) {
        const insertedComment = await collection.findOne({ _id: result.insertedId });
        res.json({
          _id: new ObjectId(),
          "comment": req.body.comment,
        });
      } else {
        res.status(500).send('Failed to insert comment');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.route('/Comments/:id').put(authenticate,async (req, res) => {
    try {
      await mongoUtil.connectToServer();
      const db = mongoUtil.getDb();
      const collection = db.collection('portfolioComments');
      const commentId = req.params.id;
      const objectId = new ObjectId(commentId); // Convert commentId to ObjectId
      const updatedComment = {
        _id: objectId,
        comment: req.body.comment
      };
      const result = await collection.replaceOne({ _id: objectId }, updatedComment);
      if (result.modifiedCount > 0) {
        res.json(updatedComment);
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});


app.delete('/Comments',authenticate,async (req, res) => {
    try {
      await mongoUtil.connectToServer();
      const db = mongoUtil.getDb();
      const collection = db.collection('portfolioComments');
      const commentId = req.query.id;
      const objectId = new ObjectId(commentId);
      const result = await collection.deleteOne({ _id: objectId });
      console.log(result);
      if (result.deletedCount === 1) {
        res.json({ message: 'Comment deleted successfully' });
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});
  
  
  
  
  
  
  
  