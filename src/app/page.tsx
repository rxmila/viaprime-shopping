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
    if (!cor) return alert("Por favor, selecione uma cor!");
    
    setCarrinho([...carrinho, { ...produto, tamanhoSelecionado: tamanho, corSelecionada: cor }]);
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
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-blue-700 italic leading-none">VIA PRIME</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">Loja Oficial</p>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {produtos.map((p) => (
          <div key={p.id} className="bg-white p-3 rounded-2xl border border-transparent hover:border-blue-500 transition-all cursor-pointer shadow-sm group" onClick={() => setSelecionado(p)}>
            <div className="bg-gray-50 rounded-xl mb-3 aspect-square flex items-center justify-center overflow-hidden">
               <img src={p.image_url} className="w-full h-full object-contain group-hover:scale-105 transition-transform p-2" />
            </div>
            <h2 className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</h2>
            <p className="text-lg font-black text-blue-700">R$ {Number(p.price).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {selecionado && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setSelecionado(null)} className="absolute top-4 right-4 text-gray-400">✕</button>
            <img src={selecionado.image_url} className="h-48 w-full object-contain mb-4" />
            <h2 className="text-xl font-black mb-1">{selecionado.name}</h2>
            <p className="text-xs text-gray-500 mb-6">{selecionado.description || 'Acabamento premium e conforto exclusivo.'}</p>
            
            <div className="space-y-6 mb-8 text-left">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tamanho</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['34', '35', '36', '37', '38', '39', '40'].map(t => (
                    <button key={t} onClick={() => setTamanho(t)}
                      className={`h-10 w-10 rounded-lg border-2 font-bold text-sm transition-all ${tamanho === t ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cor Disponível</label>
                <div className="flex gap-2 mt-2">
                  {['Preto', 'Branco', 'Bege', 'Nude'].map(c => (
                    <button key={c} onClick={() => setCor(c)}
                      className={`px-4 py-2 rounded-lg border-2 font-bold text-xs transition-all ${cor === c ? 'bg-black border-black text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => adicionarAoCarrinho(selecionado)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform hover:bg-blue-700">
              ADICIONAR AO CARRINHO
            </button>
          </div>
        </div>
      )}

      {modalCarrinho && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl md:rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">🛒 Carrinho</h2>
              <button onClick={() => setModalCarrinho(false)} className="text-gray-400 font-bold">FECHAR</button>
            </div>
            
            {carrinho.length === 0 ? (
              <p className="text-center py-10 text-gray-400 font-bold">O carrinho está vazio.</p>
            ) : (
              <>
                <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                  {carrinho.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center bg-gray-50 p-3 rounded-2xl">
                      <img src={item.image_url} className="w-12 h-12 object-contain" />
                      <div className="flex-1 text-xs font-bold text-left">
                        <p className="line-clamp-1">{item.name}</p>
                        <p className="text-blue-600 uppercase text-[9px]">{item.corSelecionada} / TAM: {item.tamanhoSelecionado}</p>
                      </div>
                      <p className="font-black">R$ {Number(item.price).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <button onClick={finalizarCompra} className="w-full bg-green-500 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-green-600 transition-colors">
                  PAGAR TUDO AGORA (PIX/CARTÃO)
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
