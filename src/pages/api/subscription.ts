import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

const stripe = new Stripe(
  "sk_test_51P4GVnIMd0c6ZBi6uf5UUvWUXwUW9OvToCFjSIRcTeZY3dp2MfLKCcyvdidHpujDsmIRjLceyQoYT6DA2heLrKR000ueKyMRp0"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(400).json({ error: "Only POST requests are allowed" });

    // const = req.body;

    const { name, email, paymentMethod } = JSON.parse(req.body)
    // Create a User with the provided name and email
//  #TODO
    // Create a customer with the provided name and email
       // Handle payment with the provided payment method

    // This step requires further implementation based on your requirements
      const customer = await stripe.customers.create({
      name,
      email,
      payment_method : paymentMethod,
      invoice_settings:{
        default_payment_method: paymentMethod
      }
    });


    // ######get existing Products of create a new One with####
    // const product  =  await stripe.products.create({
    //   name:"Basic Plan - $15"
    // })
    const product  =  await stripe.products.list()

     const productId = product.data[0]?.id


//create a subscription 
const subscription = await stripe.subscriptions.create({
  customer:customer.id,
  items:[{
    price_data: {
      currency: "USD",
      product: productId,
      unit_amount: 15,
      recurring:{
        interval:'month'
      }

    }
  }]
  ,payment_settings:{
    payment_method_types:['card'],
    save_default_payment_method:"on_subscription",

  },
  payment_behavior: 'default_incomplete',
  expand:['latest_invoice.payment_intent']
})
 
// Check if subscription and related objects are not null
// if (!subscription || !subscription.latest_invoice || !subscription.latest_invoice.payment_intent) {
//   throw new Error("Payment information not available");
// }

    // Respond with success message or necessary data
    return res.json({
      msg: "Subscription Successful",
    //  clientSecret:subscription.latest_invoice.payment_intent.client_Secret,
     subscriptionId: subscription
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong, please try again later" });
  }
}
