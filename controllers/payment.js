const BadRequestError = require("../errors/bad-request");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
module.exports.handlePayment = async (req, res) => {
  if (!req.body.amount) {
    throw new BadRequestError("Please provide an amount");
  }
  const { id } = await stripe.prices.create({
    unit_amount: req.body.amount * 100,
    currency: "ngn",
    product_data: { name: "donation" },
  });
  //   Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_ORIGIN}/?success=true`,
    cancel_url: `${process.env.CLIENT_ORIGIN}/?success=false`,
  });
  res.json({
    url: session.url,
  });
};
