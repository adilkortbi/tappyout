import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    let customerEmail: string | null | undefined;
    let customerName = 'Customer';
    let amountTotal: number | null | undefined;
    let currency = 'EUR';
    let transactionId: string;
    let metadata: Record<string, string> = {};

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      customerEmail = session.customer_details?.email;
      customerName = session.customer_details?.name || 'Customer';
      amountTotal = session.amount_total;
      currency = session.currency?.toUpperCase() || 'EUR';
      transactionId = session.id;

      // If session has a payment_intent, retrieve it for metadata
      if (session.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
        metadata = (paymentIntent.metadata || {}) as Record<string, string>;
      }
    } else {
      // payment_intent.succeeded
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      customerEmail = paymentIntent.receipt_email;
      amountTotal = paymentIntent.amount;
      currency = paymentIntent.currency?.toUpperCase() || 'EUR';
      transactionId = paymentIntent.id;
      metadata = (paymentIntent.metadata || {}) as Record<string, string>;

      // Get customer name from shipping if available
      if (paymentIntent.shipping?.name) {
        customerName = paymentIntent.shipping.name;
      }
    }

    if (customerEmail && amountTotal) {
      const formattedAmount = (amountTotal / 100).toFixed(2);

      // Build order items HTML from metadata
      const itemCount = parseInt(metadata['item_count'] || '0', 10);
      let orderItemsHtml = '';

      for (let i = 0; i < itemCount; i++) {
        const itemName = metadata[`item_${i}_name`] || 'Product';
        const itemPrice = parseFloat(metadata[`item_${i}_price`] || '0').toFixed(2);
        const itemQuantity = metadata[`item_${i}_quantity`] || '1';
        const itemImage = metadata[`item_${i}_image`] || '';
        const itemNfcUrl = metadata[`item_${i}_nfcUrl`] || '';

        orderItemsHtml += `
          <div style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee;">
            ${itemImage ? `<img src="${itemImage.startsWith('/') ? 'https://tappy-out.com' + itemImage : itemImage}" alt="${itemName}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 15px;" />` : ''}
            <div style="flex: 1;">
              <p style="margin: 0; font-weight: bold;">${itemName}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Quantity: ${itemQuantity}</p>
              ${itemNfcUrl ? `<p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">NFC Link: <a href="${itemNfcUrl}" style="color: #0066cc;">${itemNfcUrl}</a></p>` : ''}
            </div>
            <p style="margin: 0; font-weight: bold;">€${itemPrice}</p>
          </div>
        `;
      }

      try {
        await resend.emails.send({
          from: 'Tappy Out <orders@tappy-out.com>',
          to: customerEmail,
          subject: 'Your Tappy Out Order Confirmation',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Thank you for your purchase!</h1>
              <p>Hi ${customerName},</p>
              <p>Your payment has been successfully processed. Here are your order details:</p>

              ${orderItemsHtml ? `
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Order Items</h2>
                ${orderItemsHtml}
              </div>
              ` : ''}

              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin: 0 0 10px 0; color: #333;">Receipt</h2>
                <p style="margin: 5px 0;"><strong>Amount:</strong> ${formattedAmount} ${currency}</p>
                <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${transactionId}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              <p>If you have any questions, please contact our support team.</p>
              <p>Best regards,<br/>The Tappy Out Team</p>
            </div>
          `,
        });

        console.log(`Receipt email sent to ${customerEmail}`);
      } catch (emailError) {
        console.error('Failed to send receipt email:', emailError);
      }
    }
  }

  return NextResponse.json({ received: true });
}
