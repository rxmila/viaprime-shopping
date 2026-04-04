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
  const [tamanho, setTamanho] = useState('');
  const [cor, setCor] = useState('');
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [modalCarrinho, setModalCarrinho] = useState(false);

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('products').select('*');
      if (data) setProdutos(data);
    }
    carregar();
  }, []);

  const adicionarAoCarrinho = (produto: any) => {
    if (!tamanho) return alert("Por favor, selecione um tamanho!");
    setCarrinho([...carrinho, { ...produto, tamanhoSelecionado: tamanho, corSelecionada: cor || 'Padrão' }]);
    setSelecionado(null);
    setTamanho('');
    setCor('');
    setModalCarrinho(true);
  };

  const finalizarCompra = async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: carrinho }),
    });
    const data = await response.json();
    if (data.init_point) window.location.href = data.init_point;
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-black font-sans">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-blue-700 italic leading-none">VIA PRIME</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Authentic Footwear</p>
        </div>
        <button onClick={() => setModalCarrinho(true)} className="bg-blue-50 p-3 rounded-xl relative hover:bg-blue-100 transition">
          <span className="text-xl">🛒</span>
          {carrinho.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
              {carrinho.length}
            </span>
          )}
        </button>
      </header>

      {/* VITRINE */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {produtos.map((p) => (
          <div key={p.id} className="bg-white p-3 rounded-2xl border border-transparent hover:border-blue-500 transition-all cursor-pointer group shadow-sm" 
               onClick={() => setSelecionado(p)}>
            <div className="bg-gray-50 rounded-xl mb-3 overflow-hidden aspect-square flex items-center justify-center">
               <img src={p.image_url} className="w-full h-full object-contain group-hover:scale-110 transition-transform p-2" />
            </div>
            <h2 className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</h2>
            <p className="text-lg font-black text-blue-700 mt-1">R$ {Number(p.price).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* MODAL DETALHES */}
      {selecionado && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <img src={selecionado.image_url} className="h-48 w-full object-contain mb-4" />
            <h2 className="text-xl font-black mb-1">{selecionado.name}</h2>
            <p className="text-xs text-gray-500 mb-6">{selecionado.description || 'Design exclusivo e conforto máximo para o seu dia a dia.'}</p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tamanho</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['34','35', '36', '37', '38', '39', '40'].map(t => (
                    <button key={t} onClick={() => setTamanho(t)}
                      className={`h-10 w-10 rounded-lg border-2 font-bold text-sm transition-all ${tamanho === t ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => adicionarAoCarrinho(selecionado)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 active:scale-95 transition-all">
              ADICIONAR AO CARRINHO
            </button>
            <button onClick={() => setSelecionado(null)} className="w-full text-gray-400 font-bold mt-4 text-sm">Voltar</button>
          </div>
        </div>
      )}

      {/* MODAL CARRINHO */}
      {modalCarrinho && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
          <div className="bg-white rounded-t-3xl md:rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2">🛒 Seu Carrinho</h2>
            {carrinho.length === 0 ? (
              <p className="text-gray-400 font-bold py-10 text-center">O carrinho está vazio.</p>
            ) : (
              <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {carrinho.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl">
                    <img src={item.image_url} className="w-16 h-16 object-contain" />
                    <div className="flex-1">
                      <p className="text-xs font-black leading-tight">{item.name}</p>
                      <p className="text-[10px] font-bold text-blue-600">Tam: {item.tamanhoSelecionado}</p>
                    </div>
                    <p className="font-black text-sm">R$ {Number(item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={finalizarCompra} disabled={carrinho.length === 0} 
                    className="w-full bg-green-500 text-white py-5 rounded-2xl font-black text-xl shadow-lg disabled:bg-gray-200 transition-all">
              FINALIZAR PAGAMENTO
            </button>
            <button onClick={() => setModalCarrinho(false)} className="w-full text-gray-400 font-bold mt-6">Continuar comprando</button>
          </div>
        </div>
      )}
    </main>
  );
}
