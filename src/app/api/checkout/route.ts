import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuração do cliente com o seu Token do Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Criando a preferência de venda no Mercado Pago
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: body.id,
            title: body.nome,
            quantity: 1,
            unit_price: Number(body.preco),
            currency_id: 'BRL',
          }
        ],
        // Onde o cliente cai após o pagamento
        back_urls: {
          success: 'https://viaprime-shopping.vercel.app',
          failure: 'https://viaprime-shopping.vercel.app',
          pending: 'https://viaprime-shopping.vercel.app',
        },
        auto_return: 'approved',
      }
    });

    // Retorna o link que abre o checkout seguro
    return NextResponse.json({ 
      id: result.id, 
      init_point: result.init_point 
    });

  } catch (error) {
    console.error('Erro Mercado Pago:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar link de pagamento' }, 
      { status: 500 }
    );
  }
}