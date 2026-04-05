import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { cepDestino, peso, comprimento, altura, largura } = await request.json();

    const token = process.env.MELHOR_ENVIO_TOKEN;
    const url = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';

    const corpoDaRequisicao = {
      "from": { "postal_code": "18730000" }, // Seu CEP de Itaí
      "to": { "postal_code": cepDestino },
      "products": [
        {
          "id": "produto-viaprime",
          "width": largura || 15,
          "height": altura || 10,
          "length": comprimento || 20,
          "weight": peso || 0.5,
          "quantity": 1
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'ViaPrime Shopping (contato@viaprime.com)'
      },
      body: JSON.stringify(corpoDaRequisicao)
    });

    const data = await response.json();
    
    // Filtra as opções de frete que retornaram com sucesso
    const opcoesValidas = Array.isArray(data) ? data.filter((op: any) => !op.error) : [];
    
    return NextResponse.json(opcoesValidas);
  } catch (error) {
    console.error("Erro na API de frete:", error);
    return NextResponse.json({ error: "Erro ao calcular frete" }, { status: 500 });
  }
}