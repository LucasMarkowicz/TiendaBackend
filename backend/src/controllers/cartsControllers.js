const { Router } = require("express");
const router = Router();
const CartManager = require("../daos/cartManager.js");
const ProductManager = require("../daos/productManager.js");
const cartManager = new CartManager();
const productManager = new ProductManager();
const { cartVerification } = require("../middlewares/cartVerification.js");
const Ticket = require("../daos/models/ticket.Models.js");
const Cart = require("../daos/models/cart.Models");
const User = require("../daos/models/user.Models");
const Product = require("../daos/models/product.Models");
const accessRole = require("../middlewares/accessRole");
const cartErrors = require("../errors/cartErrors.js");
const userErrors = require("../errors/userErrors.js");
const logger = require("../config/logger.js");

// endpoints carrito

router.post("/", cartVerification, async (req, res) => {
  try {
    const cartId = req.session.user.associatedCart._id;
    logger.info(`ID del carrito: ${cartId}`);
    res.status(200).json({
      cartId,
    });
  } catch (error) {
    logger.error("Error en la ruta POST 'api/products/':", error);
    res.status(500).json({ message: cartErrors.GENERAL_ERROR });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCart(cid);
    if (cart) {
      const cartProducts = cart.products;
      const productArray = cartProducts.map(
        ({ product: { _id, ...rest }, quantity }) => ({ ...rest, quantity })
      );

      logger.info(`productArray: ${JSON.stringify(productArray, null, 2)}`);
      res.render("cart", { productArray, cid });
      logger.info(`cartProducts: ${JSON.stringify(cartProducts, null, 2)}`);
    } else {
      res.status(404).send(cartErrors.CART_NOT_FOUND);
    }
  } catch (error) {
    logger.error("Error en la ruta GET 'api/carts/:cid/':", error);
    res.status(500).json({ message: cartErrors.GENERAL_ERROR });
  }
});

router.get("/:cid/json", async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCart(cid);
    if (cart) {
      const cartProducts = cart.products;
      const productArray = cartProducts.map(({ product: { _id, ...rest }, quantity }) => ({ ...rest, quantity }));
      logger.info(`productArray: ${JSON.stringify(productArray, null, 2)}`);
      res.render("cart", { productArray, cid });
      logger.info(`cartProducts: ${JSON.stringify(cartProducts, null, 2)}`);
    } else {
      logger.info(`Carrito no encontrado: ${cid}`);
      res.status(404).json({ message: cartErrors.CART_NOT_FOUND });
    }
  } catch (error) {
    logger.error("Error en la ruta GET 'api/carts/:cid/json':", error);
    res.status(500).json({ message: cartErrors.GENERAL_ERROR });
  }
});

router.post("/:cid/products/:pid", accessRole("user"), async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (updatedCart) {
      res.send(updatedCart);
    } else {
      logger.info(`Carrito no encontrado: ${cid}`);
      res.status(404).json({ message: cartErrors.CART_NOT_FOUND });
    }
  } catch (error) {
    logger.error("Error en la ruta POST 'api/carts/:cid/products/:pid':", error);
    res.status(500).json({ message: cartErrors.GENERAL_ERROR });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    logger.error("Error en la ruta DELETE 'api/carts/:cid/products/:pid':", error);
    res.status(500).json({ message: cartErrors.GENERAL_ERROR });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    if (updatedCart) {
      res.json(updatedCart);
    } else {
      logger.info(`Carrito no encontrado: ${cid}`);
      res.status(404).json({ message: cartErrors.CART_NOT_FOUND });
    }
  } catch (error) {
    logger.error("Error en la ruta PUT 'api/carts/:cid/products/:pid':", error);
    res.status(500).json({ message: cartErrors.GENERAL_ERROR });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const updatedCart = await cartManager.clearCart(cid);
    res.json(updatedCart);
  } catch (error) {
    logger.error("Error en la ruta DELETE 'api/carts/:cid':", error);
    res.status(500).json({ message: cartErrors.GENERAL_ERROR });
  }
});
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateProductQuantity(
      cid,
      pid,
      quantity
    );
    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).send(cartErrors.CART_NOT_FOUND);
    }
  } catch (error) {
    logger.error(error);
    res.status(404).json({ message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    const updatedCart = await cartManager.clearCart(cid);
    res.json(updatedCart);
  } catch (error) {
    logger.error(error);
    res.status(404).json({ message: error.message });
  }
});

router.post("/:cid/purchase", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);

    if (!cart) {
      logger.info(`Carrito no encontrado: ${cid}`);
      return res.status(404).json({ error: cartErrors.CART_NOT_FOUND });
    }

    const user = await User.findOne({ associatedCart: String(cid) });
    if (!user) {
      logger.info(`Usuario no encontrado para el carrito: ${cid}`);
      return res.status(404).json({ error: userErrors.USER_NOT_FOUND });
    }

    const purchaser = user.email;

    for (const cartProduct of cart.products) {
      const product = await Product.findById(cartProduct.product._id);
      if (!product || product.stock < cartProduct.quantity) {
        logger.info(`Producto no encontrado o cantidad insuficiente en el carrito: ${cid}`);
        return res.status(400).json({ error: cartErrors.INSUFFICIENT_STOCK });
      }
    }

    for (const cartProduct of cart.products) {
      const product = await Product.findById(cartProduct.product._id);
      product.stock -= cartProduct.quantity;
      await product.save();
    }

    const code = Math.random().toString(36).substr(2, 10);
    const products = cart.toObject().products;
    const ticket = new Ticket({ code, purchaser, products });
    await ticket.save();

    await Cart.findByIdAndUpdate(cid, { products: [] });

    res.json({ message: "Compra realizada con éxito", ticket });
  } catch (error) {
    logger.error("Error en la ruta POST '/api/carts/:cid/purchase':", error);
    res.status(500).json({ error: cartErrors.PROCESSING_ERROR });
  }
});


module.exports = router;
