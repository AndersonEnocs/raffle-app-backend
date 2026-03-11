import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { constantsAppSettings } from '../../const';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private client: Stripe | null = null;

  private getStripeClient(): Stripe {
    if (this.client) return this.client;

    const secretKey = constantsAppSettings.stripeSecretKey;
    if (!secretKey) {
      this.logger.error('Stripe secret key is not configured in app settings.');
      throw new InternalServerErrorException('Stripe is not configured.');
    }

    this.client = new Stripe(secretKey, {
      apiVersion: '2024-06-20',
    });

    return this.client;
  }

  async createCheckoutSession(params: {
    amountInCents: number;
    currency: string;
    description: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    const stripe = this.getStripeClient();

    const successUrl = constantsAppSettings.stripeSuccessUrl;
    const cancelUrl = constantsAppSettings.stripeCancelUrl;

    if (!successUrl || !cancelUrl) {
      this.logger.error('Stripe success/cancel URLs are not configured in app settings.');
      throw new InternalServerErrorException('Stripe URLs are not configured.');
    }

    try {
      return await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        line_items: [
          {
            price_data: {
              currency: params.currency,
              unit_amount: params.amountInCents,
              product_data: {
                name: params.description,
              },
            },
            quantity: 1,
          },
        ],
        metadata: params.metadata,
      });
    } catch (error) {
      this.logger.error('Error creating Stripe Checkout Session', error as any);
      throw new InternalServerErrorException('Failed to create payment.');
    }
  }
}

