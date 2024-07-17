import mysql from 'mysql2/promise';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/', async (req, res, next) => {
  console.log(`get reguested from ${req.url}`);

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'SOMEDATABASE',
      namedPlaceholders: true,
      dateStrings: true,
    });
    console.log('connected!');

    // const [rows, fields] = await con.query('SHOW DATABASES');
    const [rows, fields] = await conn.query('SELECT * FROM sometable');
    // console.log(rows);
    res.contentType('application/json');
    res.status(200).json(rows);
    console.log('Response sent');

    await conn.end();
    console.log('disconnected!');
  } catch (err) {
    return next({ status: 500, message: err });
  }
});

//redirects
app.all('*', (req, res) => {
  res.status(404).send('<h3>404 Not found!</h3>');
});

//errors
app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
