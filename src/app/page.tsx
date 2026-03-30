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
        alert("Erro: Verifique o Token do Mercado Pago na Vercel.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-black">
      <header className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-black text-blue-900 tracking-tighter">VIA PRIME</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {produtos.map((produto) => (
          <div 
            key={produto.id} 
            className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-xl transition-all"
            onClick={() => setProdutoSelecionado(produto)}
          >
            <div className="relative h-72 w-full mb-4">
              <Image 
                src={produto.imagem_url} 
                alt={produto.nome} 
                fill 
                className="object-contain rounded-xl"
              />
            </div>
            {/* AQUI ESTAVA O ERRO: O NOME E PRECO DEVEM FICAR DENTRO DA DIV ACIMA */}
            <h2 className="text-lg font-bold text-gray-800">{produto.nome}</h2>
            <p className="text-2xl font-black text-green-600 mt-1">R$ {produto.preco.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative shadow-2xl">
            <button 
              onClick={() => {setProdutoSelecionado(null); setFrete(null);}} 
              className="absolute top-4 right-4 text-2xl"
            >✕</button>
            <h2 className="text-2xl font-bold mb-4">{produtoSelecionado.nome}</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Seu CEP" 
                  className="border p-3 rounded-xl flex-1 text-black outline-none focus:border-blue-500"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />
                <button onClick={calcularFrete} className="bg-gray-800 text-white px-4 rounded-xl font-bold">OK</button>
              </div>
              <button 
                onClick={handleFinalizarNoSite}
                disabled={loading}
                className="w-full bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95"
              >
                {loading ? "CONECTANDO..." : "FINALIZAR PAGAMENTO"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}