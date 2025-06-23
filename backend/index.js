require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Sweep Logic Backend!');
});

app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer(); 