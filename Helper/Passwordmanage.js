const { compareSync } = require('bcrypt');
const crypto = require('crypto')



class passwordManager {

    constructor(Plainpassword, hashPassword, salt) {
        this.Plainpassword = Plainpassword

        if(!hashPassword) this.hashPassword = null;
        else this.hashPassword = hashPassword
        
        if (!salt) this.salt = this.makeSalt()
        else this.salt = salt
       
    }

    authenticate() {
        return this.encryptPassword() === this.hashPassword
    }

    encryptPassword() {
        if (!this.Plainpassword) return ''
        
        try {
            this.hashPasswordd = crypto.createHmac('sha1', this.salt)
            .update(this.Plainpassword)
            .digest('hex')

            return this.hashPasswordd

        } catch (error) {
            return ''
        }
       
    }

    makeSalt() {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    }
}

module.exports = passwordManager