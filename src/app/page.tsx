'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'; // Importante para o clique funcionar!
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
    <main className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tighter">
          Via<span className="text-blue-600">Prime</span> Shopping
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Coleção Exclusiva 2026</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {produtos.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            
            {/* ESTA É A MÁGICA: O Link leva para a página de escolher tamanho/cor */}
            <Link href={`/produto/${item.id}`} className="cursor-pointer block">
              <div className="relative h-80 w-full overflow-hidden">
                <img 
                  src={item.imagem_url || '/placeholder.jpg'} 
                  alt={item.nome}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600">
                  {item.nome}
                </h3>
                <p className="text-2xl font-black text-slate-900 mb-4">R$ {item.preco.toFixed(2)}</p>

                <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-700 transition-all">
                  Ver Detalhes e Comprar
                </button>
              </div>
            </Link>

            <div className="px-6 pb-6 text-center border-t pt-4">
               <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                 Ambiente Seguro Mercado Pago
               </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}