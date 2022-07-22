require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const indexRouter = require('./routers/index');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(indexRouter);

app.use((req, res) => {
    res.status(404).send('Not Found');
});
app.use(errorHandler);

app.listen(PORT, () => console.log(`Running on port: ${PORT}`));
