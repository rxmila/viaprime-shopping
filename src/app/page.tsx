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
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarProdutos() {
      const { data } = await supabase.from('products').select('*');
      if (data) setProdutos(data);
    }
    carregarProdutos();
  }, []);

  const calcularFrete = () => {
    if (cep.length >= 8) {
      setFrete(20.90);
    } else {
      alert("Por favor, digite um CEP válido.");
    }
  };

  const handleFinalizarNoSite = async () => {
    if (!produtoSelecionado) return;
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: produtoSelecionado.nome,
          price: produtoSelecionado.preco,
          shipping: frete || 20.90,
        }),
      });
      const data = await response.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Erro ao conectar com o pagamento seguro.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 text-black font-sans">
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-extrabold text-blue-700">VIA PRIME</h1>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loja Oficial</div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {produtos.map((produto) => (
          <div 
            key={produto.id} 
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 cursor-pointer border border-gray-100"
            onClick={() => setProdutoSelecionado(produto)}
          >
            <div className="relative h-64 w-full mb-4">
              {produto.imagem_url && (
                <Image src={produto.imagem_url} alt={produto.nome} fill className="object-contain" />
              )}
            </div>
            <h2 className="text-gray-800 font-semibold h-12 overflow-hidden">{produto.nome}</h2>
            <div className="mt-4">
              <p className="text-2xl font-bold text-blue-600">R$ {Number(produto.preco).toFixed(2)}</p>
              <p className="text-xs text-green-600 font-bold">Frete Grátis Disponível</p>
            </div>
          </div>
        ))}
      </div>

      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button onClick={() => setProdutoSelecionado(null)} className="absolute top-4 right-4 text-2xl text-gray-400">✕</button>
            <h2 className="text-xl font-bold mb-4">{produtoSelecionado.nome}</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Seu CEP" 
                  className="border p-3 rounded-lg flex-1 text-black outline-none"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />
                <button onClick={calcularFrete} className="bg-gray-800 text-white px-4 rounded-lg">OK</button>
              </div>
              <button 
                onClick={handleFinalizarNoSite}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                {loading ? "CONECTANDO..." : "COMPRAR AGORA"}
              </button>
              <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">Pagamento 100% Seguro</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
