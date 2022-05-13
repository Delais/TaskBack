require('dotenv').config()
const jwt = require('jsonwebtoken');


function generarToken(payload,time){
    const Token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: time
    })
    return Token
}

function decodificarToken(token){
    const TokenDeoced = jwt.verify(token,process.env.SECRET)
    return TokenDeoced
}

module.exports = {
    generarToken,
    decodificarToken
}