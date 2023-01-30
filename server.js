const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const db = process.env.DATABASE;
mongoose.set('strictQuery', true);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection Success!'));

const port = process.env.PORT || 8000;

console.log(`Server is Running in ${process.env.NODE_ENV} mode`);

const server = app.listen(port, () => {
  console.log(`Server is listening to Port ${port}`);
});
