"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// Conexão com o seu banco de dados Supabase
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

  // Carregar produtos do banco de dados ao abrir o site
  useEffect(() => {
    async function carregarProdutos() {
      const { data } = await supabase.from('produtos').select('*');
      if (data) setProdutos(data);
    }
    carregarProdutos();
  }, []);

  // Simulação de frete padrão
  const calcularFrete = () => {
    if (cep.length >= 8) {
      setFrete(20.90);
    } else {
      alert("Por favor, digite um CEP válido.");
    }
  };

  // Função que envia o pedido para o Mercado Pago
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
        // Redireciona o cliente para o checkout seguro
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar link de pagamento. Verifique as chaves na Vercel.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-black">
      <header className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tighter">VIA PRIME</h1>
        <p className="text-gray-500 mt-2">Sua vitrine de calçados premium</p>
      </header>

      {/* Grid de Produtos - Renderiza o que vem do Supabase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {produtos.map((produto) => (
          <div 
            key={produto.id} 
            className="bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-xl transition-all border border-transparent hover:border-blue-100"
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
            <h2 className="text-lg font-bold text-gray-800">{produto.nome}</h2>
            <p className="text-2xl font-black text-green-600 mt-2">R$ {produto.preco.toFixed(2)}</p>
            <button className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg font-semibold text-sm">
              VER DETALHES
            </button>
          </div>
        ))}
      </div>

      {/* Modal Detalhado do Produto */}
      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-8 relative overflow-y-auto max-h-[95vh] shadow-2xl">
            <button 
              onClick={() => {setProdutoSelecionado(null); setFrete(null);}} 
              className="absolute top-6 right-6 text-3xl font-light hover:text-red-500 transition-colors"
            >✕</button>
            
            <div className="flex flex-col md:flex-row gap-10">
              {/* Imagem do Produto no Modal */}
              <div className="flex-1 relative h-[450px] bg-gray-50 rounded-2xl">
                <Image 
                  src={produtoSelecionado.imagem_url} 
                  alt={produtoSelecionado.nome} 
                  fill 
                  className="object-contain p-4" 
                />
              </div>
              
              {/* Detalhes e Checkout */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{produtoSelecionado.nome}</h2>
                  <p className="text-4xl font-black text-green-600 mt-2">R$ {produtoSelecionado.preco.toFixed(2)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-bold text-gray-700 mb-2">Sobre o produto</h3>
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    {produtoSelecionado.descricao || "Acabamento premium, conforto e estilo exclusivo Via Prime."}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase">Calcular Frete</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Seu CEP" 
                      className="border border-gray-300 p-3 rounded-xl flex-1 text-black focus:ring-2 focus:ring-blue-500 outline-none"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                    />
                    <button 
                      onClick={calcularFrete} 
                      className="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-colors"
                    >OK</button>
                  </div>
                  {frete && (
                    <p className="text-green-700 font-bold text-sm flex items-center gap-2">
                      <span>🚚</span> Entrega garantida por R$ {frete.toFixed(2)}
                    </p>
                  )}
                </div>

                <button 
                  onClick={handleFinalizarNoSite}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "CONECTANDO..." : "FINALIZAR NO SITE"}
                </button>
                <p className="text-center text-xs text-gray-400">Ambiente de pagamento 100% seguro</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}