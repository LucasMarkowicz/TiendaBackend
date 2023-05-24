const User = require("../daos/models/user.Models.js");
const CartManager = require("../daos/cartManager.js");
const cartM = new CartManager();
const logger = require('../config/logger.js')

async function cartVerification(req, res, next){
    const {email} = req.session.user
    if(!req.session.user.hasOwnProperty("associatedCart" || req.session.user.associatedCart._id === null)){
        const cartCreated = await cartM.createCart()
        req.session.user.associatedCart = cartCreated
        logger.info(`req.session.user.associatedCart._id: ${JSON.stringify(req.session.user.associatedCart._id, null, 2)}`);
        logger.info(`cartCreated: ${JSON.stringify(cartCreated, null, 2)}`);
        const users = await User.findOneAndUpdate({email}, {associatedCart: cartCreated.id}, {new: true})
    }
    next()
}

module.exports = {cartVerification}