const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const mysql = require("mysql");
const data_b = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.info
});

const generateToken = (userId) => {
    // Use a more secure secret key in production
    return jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });
};

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;
    data_b.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }
        if (result.length > 0) {
            return res.render('register', {
                message: "That email is already in use."
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match.'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        data_b.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User Registered.'
                });
            }
        });
    });
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).render('login', {
          message: "Please enter your Email and Password",
        });
      }
  
      data_b.query(
        "select * from users where email=?",
        [email],
        async (error, result) => {
          console.log(result);
          if (result.length <= 0) {
            return res.status(401).render('login', {
              message: "Please enter a valid Email and Password",
            });
          } else {
            if ( !result || !(await bcrypt.compare(password, result[0].password))) {
              return res.status(401).render('login', {
                message: "Incorrect Email or Password",
              });
            } else {
              const id = result[0].id;
              const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
              });
              console.log("The Token is " + token);
              const cookieOptions = {
                expires: new Date(
                  Date.now() +
                    process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
              };
              res.cookie("authToken", token, cookieOptions);
              res.status(200).redirect("/profile");
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.authToken) {
        try {
            const decoded = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
            data_b.query("SELECT * FROM users WHERE id=?", [decoded.id], (err, results) => {
                if (!results) {
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
};

exports.logout = async (req, res) => {
    res.cookie('authToken', 'logout', { 
        expires: new Date(Date.now() + 2 * 1000), 
        httpOnly: true
    });

    res.status(200).redirect('/');
};


