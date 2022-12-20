const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	emailId: {
		type: String,
		required: true
	},
    password:{
        type:String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

async function getUser(username) {
    const data = await User.findOne({username:username});
    return data;
}

async function createUser(username,email_id,password) {
      const data = await User.create({
        emailId: email_id,
        username: username,
        password: password,
     })
     return data;
}

module.exports = {
    getUser,
    createUser
}