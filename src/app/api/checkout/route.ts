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
      title: `${item.name} (${item.corSelecionada} - ${item.tamanhoSelecionado})`,
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
          excluded_payment_types: [], // Deixa vazio para liberar o PIX
          installments: 12
        }
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error) {
    console.error("Erro no Mercado Pago:", error);
    return NextResponse.json({ error: 'Falha ao gerar link' }, { status: 500 });
  }
}
