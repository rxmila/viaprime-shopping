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
    if (cep.length === 8) {
      setFrete(20.90);
    } else {
      alert("Digite um CEP válido com 8 dígitos.");
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
        alert("Erro no link de pagamento.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-12 text-blue-900">Via Prime - Vitrine</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {produtos.map((produto) => (
          <div 
            key={produto.id} 
            className="bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setProdutoSelecionado(produto)}
          >
            <div className="relative h-64 w-full mb-4">
              <Image 
                src={produto.imagem_url} 
                alt={produto.nome} 
                fill 
                className="object-contain rounded-lg"
              />
            </div>
            <h2 className="text-xl font-semibold">{produto.nome}</h2>
            <p className="text-green-600 font-bold text-2xl">R$ {produto.preco.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 relative">
            <button onClick={() => {setProdutoSelecionado(null); setFrete(null);}} className="absolute top-4 right-4 text-2xl">✕</button>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 relative h-[300px]">
                <Image src={produtoSelecionado.imagem_url} alt={produtoSelecionado.nome} fill className="object-contain" />
              </div>
              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold">{produtoSelecionado.nome}</h2>
                <p className="text-3xl text-green-600 font-bold">R$ {produtoSelecionado.preco.toFixed(2)}</p>
                <input 
                  type="text" 
                  placeholder="Seu CEP" 
                  className="border p-2 rounded w-full"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)} // <--- Corrigido aqui!
                />
                <button onClick={calcularFrete} className="bg-gray-800 text-white w-full py-2 rounded">Calcular Frete</button>
                {frete && <p className="text-green-700 font-medium">🚚 Frete: R$ {frete.toFixed(2)}</p>}
                <button 
                  onClick={handleFinalizarNoSite}
                  disabled={loading}
                  className="w-full bg-green-500 text-white text-xl font-bold py-4 rounded-xl shadow-lg"
                >
                  {loading ? "CARREGANDO..." : "FINALIZAR NO SITE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}