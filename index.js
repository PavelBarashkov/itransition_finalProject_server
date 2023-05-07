require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize =  require('./bd');
const models = require('./models/models');
const router = require('./routes/index');
const errorHandler = require('./milddleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 5000;
const app = express();

const urlDeploy = 'https://itransition-final-project-client-88jfj7mdl-pavelbarashkov.vercel.app'
const localUrl = 'http://localhost:5000'

app.use(cors({ origin: urlDeploy || localUrl, credentials: true }));
app.use(express.json());
app.use('/api', router);




app.use(errorHandler);
const start = async() => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log('Сервер запущен на порту ' + PORT));
    } catch (e) {
        console.log(e)
    }
}

start()
