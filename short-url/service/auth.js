const jwt = require('jsonwebtoken')
const secret = "santu2001"

// token assignment user k liye 
function setUser( user) {
    // const payload = {
    //     id,
    //     ...user
    // };

    return jwt.sign({
        _id: user._id,
        email:user.email
    },secret);
}

function getUser(token){
    if(!token) return null;

    try {
        return jwt.verify(token , secret)
    } catch (error) {
        return null
    }
    
}

module.exports = {
    setUser,
    getUser
}



//state full authentication 

/*
const sessionIdToUserMap = new Map();

function setUser(id, user) {
    sessionIdToUserMap.set(id,user);
}

function getUser(id){
    return sessionIdToUserMap.get(id);
}

module.exports = {
    setUser,
    getUser
}
*/