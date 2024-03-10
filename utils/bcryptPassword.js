const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
function bcryptPassword(password){
    return new Promise((resolve,reject)=>{
        bcrypt.hash(password,salt, function(err,hash){
            if(err){
                reject(err)
            }else{
                resolve(hash)
            }
        })
    })
}

module.exports = bcryptPassword;