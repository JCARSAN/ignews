import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";
import { query as q } from 'faunadb';

type User = {
    ref: {
        id: string;
    },
    data: {
        stripe_customer_id: string;
    }
}

export default async(req: NextApiRequest, res:NextApiResponse) => {
    if(req.method === 'POST'){
        const session = await getSession({ req })

        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )
        
        let customerId = user.data.stripe_customer_id;

        if(!customerId){
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email
    
            })

            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id,
                        }
                    }
                )
            );

            customerId = stripeCustomer.id;
        }

        const stripeCheckoutSesion = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1L5s7TKQ9TaopPMCcCbV6FhE', quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return res.status(200).json({sessionId: stripeCheckoutSesion.id})
    }else{
        res.setHeader('Allow','POST')
        res.status(405).send('Method not allowed!');
    }
}