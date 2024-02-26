const { handlePayment } = require("../controllers/payment");

const router = require("express").Router();

router.route("/checkout").post(handlePayment);
module.exports = router;
