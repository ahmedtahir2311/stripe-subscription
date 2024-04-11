import React, { useState } from "react";
import Head from "next/head";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { Elements } from "@stripe/react-stripe-js";

const Index = () => {
  const stripePromise = loadStripe(
    "pk_test_51P4GVnIMd0c6ZBi6lIzaQVr4hr8g99M0m948PopN2u6Lp3C7umP1JygdYkCGQeG9NAIAfcrIgibOVcsYDuhAC7jE001mFAaqMj"
  );

  const options = {
    // passing the client secret obtained from the server
    clientSecret:
      "sk_test_51P4GVnIMd0c6ZBi6uf5UUvWUXwUW9OvToCFjSIRcTeZY3dp2MfLKCcyvdidHpujDsmIRjLceyQoYT6DA2heLrKR000ueKyMRp0",
  };

  return (
    <>
      {" "}
      <Head>
        <title>Login | Bidfunnel</title>
      </Head>
      <Elements
        stripe={stripePromise}

        //   options={options}
      >
        <PaymentForm />
      </Elements>
    </>
  );
};

export default Index;

const PaymentForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // stripe items
  const stripe = useStripe();
  const elements = useElements();

  const options = {
    // passing the client secret obtained from the server
    clientSecret:
      "sk_test_51P4GVnIMd0c6ZBi6uf5UUvWUXwUW9OvToCFjSIRcTeZY3dp2MfLKCcyvdidHpujDsmIRjLceyQoYT6DA2heLrKR000ueKyMRp0",
  };
  const onSubscribe = async (e) => {
    try {
      const paymentMethod = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement("card"),
      });

      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          Authorization: `Bearer sk_test_51P4GVnIMd0c6ZBi6uf5UUvWUXwUW9OvToCFjSIRcTeZY3dp2MfLKCcyvdidHpujDsmIRjLceyQoYT6DA2heLrKR000ueKyMRp0`,
        },
        body: JSON.stringify({
          name,
          email,
          paymentMethod: paymentMethod.paymentMethod.id,
        }),
      });

      if (!res.ok) return console.log("payment UnsuccessFul");

      const data = await res.json();
      console.log(data);

      //confirm the payment here

      //   const confirmPayment =
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form>
        <div>
          {" "}
          Name:{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <br />
        <div>
          {" "}
          email:{" "}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <br />
        <CardElement />
        <br />

        <button type="button" onClick={onSubscribe}>
          Subscribe
        </button>
      </form>
    </div>
  );
};
