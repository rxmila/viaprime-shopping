'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);

  useEffect(() => {
    async function carregarProdutos() {
      const { data } = await supabase.from('produtos').select('*');
      if (data) setProdutos(data);
    }
    carregarProdutos();
  }, []);

  return (
    <main className="min-h-screen bg-white p-4 md:p-12">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tighter">
          Via<span className="text-blue-600">Prime</span> Shopping
        </h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {produtos.map((item) => (
          <div key={item.id} className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">
            
            {/* O Link agora envolve o card todo */}
            <Link href={`/produto/${item.id}`} className="cursor-pointer block">
              <div className="relative h-96 w-full overflow-hidden">
                <img 
                  src={item.imagem_url || '/placeholder.jpg'} 
                  alt={item.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600">
                  {item.nome}
                </h3>
                <p className="text-3xl font-black text-slate-900 mb-6">R$ {item.preco.toFixed(2)}</p>

                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                  Ver Detalhes e Comprar
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}