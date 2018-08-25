const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8080;

// ROUTES
// =============================================================================
const router = express.Router();

router.get('/test', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});



app.use('/api', router);

app.listen(port, ()=>console.log('Server started on port ' + port));

