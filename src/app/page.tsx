"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VitrineViaPrime() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarProdutos() {
      const { data } = await supabase.from('produtos').select('*');
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
        alert("Erro ao conectar com o meio de pagamento seguro.");
      }
    } catch (error) {
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b pb-6">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">VIA PRIME</h1>
        <div className="text-sm font-medium text-gray-500">Loja Oficial & Segura</div>
      </header>

      {/* Grid de Produtos - Referência Magalu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {produtos.map((produto) => (
          <div 
            key={produto.id} 
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer border border-gray-100"
            onClick={() => setProdutoSelecionado(produto)}
          >
            <div className="relative h-64 w-full mb-4">
              <Image src={produto.imagem_url} alt={produto.nome} fill className="object-contain" />
            </div>
            <h2 className="text-gray-800 font-semibold line-clamp-2 h-12">{produto.nome}</h2>
            <div className="mt-4">
              <p className="text-xs text-gray-400 line-through">R$ {(produto.preco * 1.2).toFixed(2)}</p>
              <p className="text-2xl font-bold text-blue-600">R$ {produto.preco.toFixed(2)}</p>
              <p className="text-xs text-green-600 font-bold">no Pix ou Boleto</p>
            </div>
          </div>
        ))}
      </div>

      {/* Janela de Detalhes (Modal) */}
      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 md:p-10 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setProdutoSelecionado(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl">✕</button>
            
            <div className="flex flex-col md:row gap-8">
              <div className="flex-1 relative h-80 bg-gray-50 rounded-xl">
                <Image src={produtoSelecionado.imagem_url} alt={produtoSelecionado.nome} fill className="object-contain p-4" />
              </div>
              <div className="flex-1 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">{produtoSelecionado.nome}</h2>
                <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-3xl font-black text-blue-700">R$ {produtoSelecionado.preco.toFixed(2)}</p>
                    <p className="text-sm text-blue-600">Frete rápido para todo o Brasil</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Simular Frete</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="00000-000" 
                      className="border border-gray-300 p-3 rounded-lg flex-1 text-black outline-none focus:ring-2 focus:ring-blue-500"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                    />
                    <button onClick={calcularFrete} className="bg-gray-800 text-white px-6 rounded-lg font-bold">Calcular</button>
                  </div>
                  {frete && <p className="text-green-600 font-bold">🚚 Entrega em 7 dias por R$ {frete.toFixed(2)}</p>}
                </div>

                <button 
                  onClick={handleFinalizarNoSite}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-5 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "PROCESSANDO..." : "COMPRAR AGORA"}
                </button>
                <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                    <span className="bg-gray-100 px-2 py-1 rounded">Compra Segura</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">Mercado Pago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
