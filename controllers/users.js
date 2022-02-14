const User = require('../models/user');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const ip = require('ip')

const renderRegister = (req, res) => {
    res.render('auth/register')
}

const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = new User({ username, activationToken: uuid.v4() });
        console.log(user);
        await User.register(user, password);

        const transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });
        transporter.verify().then(console.log).catch(console.error);
        var mailOptions = {
            from: 'ozn_dndr921@hotmail.com',
            to: 'ozn.dndr921@gmail.com',
            subject: 'Sending Email using Node.js',
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width">
            <title></title>
            <style></style>
            </head>
            <body>
            <div id="email" style="width:600px;">
            <table role="presentation" border="0" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>
                            Username    
                        </th>
                        <th>
                            IP address    
                        </th>
                        <th>
                            Action    
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            ${user.username}
                        </td> 
                        <td>
                            ${ip.address()}
                        </td> 
                        <td>
                        <a href="http://localhost:3000/approve-user?token=${user.activationToken}">Activate</a>
                        </td> 
                    </tr>
                </tbody>
            </table>
            </div>
            </body>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        req.flash('success', 'Başarılı bir şekilde kayıt oldunuz, lütfen mailinize gelen aktivasyon linkine tıklayınız');
        res.redirect('/');

    } catch (e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('register');
    }
}

const renderLogin = (req, res) => {
    res.render('auth/login');
}

const login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

const logout = (req, res) => {
    req.logout();
    // req.session.destroy();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}

const renderDashboard = (req, res) => {
    res.render('dashboard');
}

const activateUser = async (req, res, next) => {
    const { token } = req.query;
    const user = await User.findOne({ activationToken: token })
    if (!user) {
        req.flash('error', 'Invalid Token');
        return res.redirect('/');
    }

    user.activationToken = null;
    user.isActive = true;
    await user.save();
    req.flash('success', 'User activated successfully');
    res.redirect('/')
}

module.exports = {
    renderLogin,
    renderRegister,
    renderDashboard,
    login,
    register,
    logout,
    activateUser
}