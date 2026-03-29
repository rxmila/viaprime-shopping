import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, shipping } = body;

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: title,
            unit_price: Number(price),
            quantity: 1,
            currency_id: 'BRL',
          }
        ],
        shipments: {
            cost: Number(shipping),
            mode: "not_specified"
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://' + (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : '')}/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://' + (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : '')}/erro`,
        },
        auto_return: 'approved',
      }),
    });

    const data = await response.json();
    return NextResponse.json({ init_point: data.init_point });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar checkout' }, { status: 500 });
  }
}