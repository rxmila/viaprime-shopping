<<<<<<< HEAD
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
          success: `https://${process.env.VERCEL_URL}/sucesso`,
          failure: `https://${process.env.VERCEL_URL}/erro`,
        },
        auto_return: 'approved',
      }),
    });

    const data = await response.json();
    return NextResponse.json({ init_point: data.init_point });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
=======
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    const productList = items.map((item: any) => ({
      id: item.id,
      title: `${item.name} (${item.corSelecionada} - Tam: ${item.tamanhoSelecionado})`,
      unit_price: Number(item.price),
      quantity: 1,
      currency_id: 'BRL'
    }));

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: productList,
        back_urls: {
          success: "https://viaprime-shopping.vercel.app/",
          failure: "https://viaprime-shopping.vercel.app/",
          pending: "https://viaprime-shopping.vercel.app/",
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_types: [], // Mantém vazio para habilitar PIX
          installments: 12
        }
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error) {
    console.error("Erro MP:", error);
    return NextResponse.json({ error: 'Erro ao gerar link de pagamento' }, { status: 500 });
  }
}
>>>>>>> 651f0c5aa3650a91f8ea27e363ddb24dc284f73c
