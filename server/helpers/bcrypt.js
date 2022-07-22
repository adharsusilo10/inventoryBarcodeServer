const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = {
  hashPassword: (password) => {
    return bcrypt.hashSync(password, saltRounds);
  },
  comparePassword: (password, hashed) => {
    return bcrypt.compareSync(password, hashed);
  }
}