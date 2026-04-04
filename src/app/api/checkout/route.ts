 import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    // Monta a lista de produtos para o Mercado Pago
    const productList = items.map((item: any) => ({
      id: item.id,
      title: `${item.name} - Tam: ${item.tamanhoSelecionado}`,
      unit_price: Number(item.price),
      quantity: 1,
      currency_id: 'BRL'
    }));

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: productList,
        // REDIRECIONAMENTO (Corrige o Erro 404)
        back_urls: {
          success: "https://viaprime-shopping.vercel.app/",
          failure: "https://viaprime-shopping.vercel.app/",
          pending: "https://viaprime-shopping.vercel.app/",
        },
        auto_return: "approved",
        // GARANTE QUE PIX ESTEJA ATIVO
        payment_methods: {
          installments: 12,
          excluded_payment_types: [], // Vazio para aceitar TUDO (incluindo PIX)
        }
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar preferência' }, { status: 500 });
  }
}
