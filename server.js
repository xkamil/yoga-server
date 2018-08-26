const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const compression = require('compression');



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

const port = process.env.PORT || 8080;

// ROUTES
// =============================================================================
const router = express.Router();

router.get('/test', function (req, res) {
    res.json({message: 'hooray! welcome to our api!' + new Date().getMilliseconds()});
});


router.get('/portals', function (req, res) {
    const portals = require('./portals.json');
    res.json(portals);
});

router.get('/portals/:name', function (req, res) {
    const path = `./portals/${req.params.name}.json`;


    if (fs.existsSync(path)) {
        const portal = require(path);
        res.json(portal);
    } else {
        res.status(404).json({message: `portal ${req.params.name} does not exists.`})
    }
});


app.use('/api', router);

app.listen(port, () => console.log('Server started on port ' + port));

