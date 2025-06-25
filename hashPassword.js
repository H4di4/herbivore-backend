const bcrypt = require('bcrypt');

const password = '12345678'; 

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('Hashed password:', hash);
  })
  .catch(err => {
    console.error('Error hashing password:', err);
  });
