"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function VitrineViaPrime() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarProdutos() {
      const { data } = await supabase.from('products').select('*');
      if (data) setProdutos(data);
      setLoading(false);
    }
    carregarProdutos();
  }, []);

  const handleComprar = async (produto: any) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: produto.name,
          price: Number(produto.price),
          quantity: 1
        }),
      });
      
      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point; // Abre o Mercado Pago
      } else {
        alert("Erro ao gerar pagamento. Verifique suas chaves na Vercel.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <main className="min-h-screen bg-white p-8 font-sans text-black">
      <header className="flex justify-between items-center border-b pb-4 mb-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-600">VIA PRIME</h1>
        <span className="text-xs text-gray-400 uppercase tracking-widest">Loja Oficial</span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {produtos.map((produto) => (
          <div key={produto.id} className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="relative h-64 w-full mb-4 bg-gray-50 rounded-md">
                <img 
                  src={produto.image_url} 
                  alt={produto.name}
                  className="object-contain w-full h-full p-2"
                />
              </div>
              <h2 className="font-semibold text-gray-800 mb-2">{produto.name}</h2>
              <p className="text-xl font-bold text-gray-900 mb-4">
                R$ {Number(produto.price).toFixed(2).replace('.', ',')}
              </p>
            </div>
            <button 
              onClick={() => handleComprar(produto)}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-bold"
            >
              COMPRAR AGORA
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
