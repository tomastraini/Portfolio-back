const router = require('../router')
router.route('*').all(async (req, res) => {
    res.status(404).json({error: "Not found!"});
});