"use server";
import { Stripe } from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

const checkoutSession = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const { items } = req.body;
    console.log("items", items);

    const session = await stripe.checkout.sessions.create({
      success_url: `http://localhost:3000/checkout`,
      line_items: [
        {
          quantity: 2,
          price_data: {
            currency: "usd",
            product_data: { name: "Cool T-shirt" },
            unit_amount: 12000, // $120.00 in cents
          },
        },
      ],
      mode: "payment",
    });
    return res.status(200).json({ id: session.id });
  }
  return res.status(405).json({ error: "Method not allowed" });
};

export default checkoutSession;
