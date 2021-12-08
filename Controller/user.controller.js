const {
    getUserbyEmail,
    RegisterUser,
    verifyUser,
    updateLink,
    PasswordLink,
    UpdatePassword
} = require('../Query/query');


const jwt = require('jsonwebtoken')
const conn = require('../Dbconnection/connection')
const passwordManager = require('../Helper/Passwordmanage')
const sendgridmail = require('@sendgrid/mail')
sendgridmail.setApiKey(process.env.SENDGRID_API);

exports.signUp = (req, res) => {
    const passwordHelperObj = new passwordManager(req.body.password, null, null)
    const hashedpassword = passwordHelperObj.encryptPassword();
    const salt = passwordHelperObj.salt

    const { fullname, email } = req.body

    conn.query(
        RegisterUser(
            req.body.fullname,
            req.body.email,
            hashedpassword,
            salt,
            req.body.appRole
        ),
        err => {
            if (err) {
                console.log(err)
                if (err.code == 'ER_DUP_ENTRY') {
                    return res.status(400).json({
                        error: 'Account already exists with this email address'
                    })
                } else {
                    return res.status(400).json({
                        error: 'Server Error! Please try again later.'
                    })
                }
            } else {
                const token = jwt.sign({ fullname, email },
                    process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '1h' }
                )

                const emailData = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: `Account activation link`,
                    html: `<h2>please use this link to activate your account</h2>
                                    <h4>${process.env.CLIENT_URL}/auth/activate/${token}</h4>
                                    <hr/>
                                    <p>please donot share this link to anyone</p>
                                   <p>${process.env.CLIENT_URL}</p>
                 `
                }
                sendgridmail
                    .send(emailData)
                    .then(sent => {
                        return res.status(200).json({
                            message: `Email has been send to ${email}.Follow the instruction to activate your account.`
                        })
                    })
                    .catch(err => console.error(err));
            }
        }
    )
};


exports.ResendVerify = (req, res) => {
    const {fullname ,email } = req.body;
    conn.query(getUserbyEmail(email), (err, result) => {
        if (err || !result[0]) {
            return res.status(400).json({
                error: 'User with this email doesnot exist'
            })
        } else {
            if (result[0].isVerified) {
                return res.status(400).json({
                    error: 'Email address is already verified.Please login to continue.'
                })
            } else {
                const token = jwt.sign({ fullname, email },
                    process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: '1h' }
                )
                const emailData = {
                    from: process.env.EMAIL_FROM,
                    to: email,
                    subject: `Account activation link`,
                    html: `<h2>please use this link to activate your account</h2>
                                    <h4>${process.env.CLIENT_URL}/auth/activate/${token}</h4>
                                    <hr/>
                                    <p>please donot share this link to anyone</p>
                                   <p>${process.env.CLIENT_URL}</p>
                 `
                }
                sendgridmail
                    .send(emailData)
                    .then(sent => {
                        return res.status(200).json({
                            message: `Email has been send to ${email}.Follow the instruction to activate your account.`
                        })
                    })
                    .catch(err => console.error(err));
            }
        }
    })
}






exports.accountActivation = (req, res) => {
    const { token } = req.body
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(
            err,
            decoded
        ) {
            if (err) {
                return res.status(400).json({
                    error: 'Expired Link.Login and try again'
                })
            }
            const {fullname,email } = jwt.decode(token)

            conn.query(getUserbyEmail(email),(err,result)=>{
                 if(!(err || result.length == 0)){
                     if(result[0].isVerified){
                        return res.status(200).json({
                            message: 'Your account is already verified.Please Login to continue.'
                       })
                     }else{
                        conn.query(verifyUser(email), err => {
                            if (err) {
                                console.log(err)
                                return res.status(401).json({
                                    message: 'Something went wrong.Please try again.'
                                })
                            } else {
                                return res.status(200).json({
                                    message: 'Verified.Please Login to continue'
                             })
                            }
                        })
                     }
                 }
            })
        })
    } else {
        return res.status(400).json({
            message: 'Something went wrong.Please try again.'
        })
    }
}

exports.Login = (req, res) => {
    conn.query(getUserbyEmail(req.body.email), (err, result) => {
        if (err) {
            return res.status(400).json({
                error: 'Server Error! Please try again later.'
            })
        }

        if (result.length == 0) {
            return res.status(400).json({
                error: 'The email you entered isn’t connected to an account.Please check your email and try again.'
            })
        } else {

            const passwordHelperObj = new passwordManager(
                req.body.password,
                result[0].hashedpassword,
                result[0].salt
            )
             
            if (passwordHelperObj.authenticate()) {

                const token = jwt.sign({ _id: result[0].salt },
                    process.env.JWT_SECRET, {
                        expiresIn: '1d'
                    }
                )

                  const { fullname, email, appRole, isVerified } = result[0]

               
                    return res.status(200).json({
                        token,
                        userData: { fullname, email, appRole ,isVerified}
                    })
    

            } else {
                return res.status(400).json({
                    error: 'The password you’ve entered is incorrect.'
                })
            }
        }
    })
}

exports.forgotPassword = (req, res) => {
    const { email } = req.body
    conn.query(getUserbyEmail(email), (err, result) => {
        if (err || result.length == 0) {
            return res.status(400).json({
                error: 'User with this email doesnot exist'
            })
        } else {
            const token = jwt.sign({ email:email, name: result[0].fullname },
                process.env.JWT_RESET_PASSWORD, {
                    expiresIn: '10m'
                }
            )
            conn.query(updateLink(email, token), (err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Database connection error!'
                    })
                } else {
                    const emailData = {
                        from: process.env.EMAIL_FROM,
                        to: email,
                        subject: `Password reset link`,
                        html: `<h2>please use this link to reset your account password</h2>
                                           <h4>${process.env.CLIENT_URL}/auth/password/reset/${token}</h4>
                                            <hr/>
                                            <p>please donot share this link to anyone</p>
                                            <p>${process.env.CLIENT_URL}</p>
                                          `
                    }
                    sendgridmail
                        .send(emailData)
                        .then(sent => {
                            return res.json({
                                message: `Email has been send to ${email}.Follow the instruction to reset your password.`
                            })
                        })
                        .catch(err => console.error(err))
                }
            })
        }
    })
}

exports.resetPassword = (req, res) => {
    const {email,resetPasswordlink,newPassword } = req.body;
   

    if (resetPasswordlink) {
        jwt.verify(
            resetPasswordlink,
            process.env.JWT_RESET_PASSWORD,
            (err, decode) => {
                if (err) {
                    return res.status(400).json({
                        error: 'Expired Link.Try Again!'
                    })
                } else {
                    conn.query(PasswordLink(resetPasswordlink), (err, result) => {
                
                        if (err || result.length == 0) {
                            return res.status(400).json({
                                error: 'Something went wrong.Try Again!'
                            })
                        } else {
                            const passwordHelperObj = new passwordManager(
                                newPassword,
                                null,
                                null
                            )
                            const hashedpassword = passwordHelperObj.encryptPassword()
                            const salt = passwordHelperObj.salt;
                            

                            conn.query(
                                UpdatePassword(email,null, hashedpassword, salt),
                                err => {
                                    if (err) {
                                        console.log(err);
                                        return res.status(401).json({
                                            error: 'Error.Please try again'
                                        })
                                    }
                                    return res.status(200).json({
                                        message: 'Great.now you can login to your account.'
                                    })
                                }
                            )
                        }
                    })
                }
            }
        )
    } else {
        return res.status(401).json({
            error: 'Error.please try again'
        })
    }
}