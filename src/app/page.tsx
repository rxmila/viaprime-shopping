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
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('products').select('*');
      if (data) setProdutos(data);
    }
    carregar();
  }, []);

  const handleComprar = async (produto: any) => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: produto.name,
        price: Number(produto.price) + (frete ? 20.90 : 0), // Exemplo de frete somado
        quantity: 1
      }),
    });
    const data = await response.json();
    if (data.init_point) window.location.href = data.init_point;
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-black text-blue-700 italic">VIA PRIME</h1>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">LOJA OFICIAL</div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {produtos.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:shadow-md transition"
               onClick={() => setSelecionado(p)}>
            <img src={p.image_url} alt={p.name} className="h-48 w-full object-contain mb-4" />
            <h2 className="font-medium text-gray-700 h-12 overflow-hidden">{p.name}</h2>
            <p className="text-2xl font-black mt-2">R$ {Number(p.price).toFixed(2)}</p>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-bold">VER DETALHES</button>
          </div>
        ))}
      </div>

      {/* MODAL DE CHECKOUT INTERMEDIÁRIO */}
      {selecionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setSelecionado(null)} className="absolute top-4 right-4 text-2xl">✕</button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img src={selecionado.image_url} className="w-full h-64 object-contain bg-gray-50 rounded-xl" />
              
              <div>
                <h2 className="text-xl font-bold mb-2">{selecionado.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{selecionado.description || "Produto premium com acabamento exclusivo Via Prime."}</p>
                
                {/* VARIAÇÕES */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Escolha o Tamanho</label>
                  <div className="flex gap-2">
                    {['35', '36', '37', '38', '39'].map(t => (
                      <button key={t} className="border w-10 h-10 rounded-md hover:border-blue-600 hover:text-blue-600 transition font-bold">{t}</button>
                    ))}
                  </div>
                </div>

                {/* CEP/FRETE */}
                <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Calcular Frete</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="00000-000" className="border p-2 rounded flex-1 text-sm outline-none" 
                           value={cep} onChange={(e) => setCep(e.target.value)} />
                    <button onClick={() => setFrete("R$ 20,90")} className="bg-gray-800 text-white px-4 py-1 rounded text-sm">OK</button>
                  </div>
                  {frete && <p className="text-green-600 text-xs font-bold mt-2">✓ Frete: {frete} (Entrega em 4 dias)</p>}
                </div>

                <button onClick={() => handleComprar(selecionado)} className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-black text-lg shadow-lg transition-transform active:scale-95">
                  FINALIZAR COMPRA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
