"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function VitrineViaPrime() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [selecionado, setSelecionado] = useState<any>(null);
  const [carrinho, setCarrinho] = useState<any[]>([]);

  useEffect(() => {
    async function carregarProdutos() {
      const { data } = await supabase.from('products').select('*');
      if (data) setProdutos(data);
    }
    carregarProdutos();
  }, []);

  const finalizarCompra = async (produto: any) => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [produto] }),
    });
    const data = await res.json();
    if (data.init_point) window.location.href = data.init_point;
  };

  return (
    <main className="min-h-screen bg-white p-4">
      <header className="border-b mb-8 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">VIA PRIME</h1>
        <span className="text-[10px] text-gray-400">LOJA OFICIAL</span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {produtos.map((p) => (
          <div key={p.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <img src={p.image_url} alt={p.name} className="w-full h-48 object-contain mb-4" />
            <h2 className="text-sm font-medium text-gray-700">{p.name}</h2>
            <p className="text-xl font-bold my-2">R$ {Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <button 
              onClick={() => finalizarCompra(p)}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700"
            >
              Comprar Agora
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
