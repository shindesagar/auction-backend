const stripe = require("stripe")(
  "sk_test_51Oool4SIiKMrNAexO7BpxRwBUSGcvMc0IBTtyb2XYzumcbDaCi2oMj7VK9nxj52guTmTsssJAFkGoRKaWw8YfYO400Zwq9xQ5Y"
);

const MakePayment = async (req,res)=>{
  const { product, amount } = req.body;
  const unitAmount = Math.round(amount * 100);
  console.log(req);
  const lineItems = [
    // isko same rakhna hai
    {
      price_data: {
        currency: "INR",
        product_data: {
          name: product,
        },
        unit_amount: unitAmount,
      },
      quantity: 1,
      
    },
  ];
  
  const customer = await stripe.customers.create({
    name: "Harshit Yadav",
    email: "inbox.harshityadav@gmail.com",
  });
  const customerUpdated = await stripe.customers.update(customer.id, {
    address: {
      city: "New Delhi",
      country: "India",
      line1: "Street, PO Box, or company name",
      line2: "Street2, PO Box2, or company name2",
      postal_code: "110034",
      state: "New Delhi",
    },
    shipping: {
      name: "Jenny Rosen",
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
    },
  });
  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/payment-success",
    cancel_url: "http://localhost:3000/payment-failed",
  });
  return res.json({ id: session.id });
}
module.exports={
    MakePayment,
}