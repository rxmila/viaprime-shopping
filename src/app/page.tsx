"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error("Erro ao buscar produtos:", error);
      } else if (data) {
        setProdutos(data);
      }
      setLoading(false);
    }
    carregarProdutos();
  }, []);

  return (
    <main className="min-h-screen bg-white p-8">
      <header className="flex justify-between items-center border-b pb-4 mb-8">
        <h1 className="text-2xl font-bold text-blue-600">VIA PRIME</h1>
        <span className="text-xs text-gray-400 uppercase tracking-widest">Loja Oficial</span>
      </header>

      {loading ? (
        <p className="text-center text-gray-500">Carregando vitrine...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <div key={produto.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <div className="relative h-64 w-full mb-4">
                <img 
                  src={produto.image_url} 
                  alt={produto.name}
                  className="object-contain w-full h-full"
                />
              </div>
              <h2 className="font-semibold text-gray-800 mb-2">{produto.name}</h2>
              <p className="text-xl font-bold text-gray-900 mb-4">
                R$ {Number(produto.price).toFixed(2).replace('.', ',')}
              </p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-medium">
                Comprar Agora
              </button>
            </div>
          ))}
        </div>
      )}
      
      <a 
        href="https://wa.me/SEUNUMERO" 
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition flex items-center gap-2"
      >
        <span>Falar com a Via Prime</span>
      </a>
    </main>
  );
}
