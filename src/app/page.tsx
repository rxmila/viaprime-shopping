 "use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// Conexão com o Supabase
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

  // Carrega produtos do banco de dados
  useEffect(() => {
    async function carregarProdutos() {
      const { data } = await supabase.from('produtos').select('*');
      if (data) setProdutos(data);
    }
    carregarProdutos();
  }, []);

  // Simulação de frete conforme seu padrão de R$ 20,90
  const calcularFrete = () => {
    if (cep.length >= 8) {
      setFrete(20.90);
    } else {
      alert("Por favor, digite um CEP válido.");
    }
  };

  // FUNÇÃO DE CHECKOUT - SUBSTITUI O ALERT ANTIGO
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
        // Redireciona para o Mercado Pago
        window.location.href = data.init_point;
      } else {
        console.error("Erro da API:", data);
        alert("Erro ao gerar link de pagamento. Verifique as chaves na Vercel.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <header className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900">VIA PRIME</h1>
        <p className="text-gray-500 mt-2">Sua vitrine de calçados premium</p>
      </header>

      {/* Grid de Produtos */}
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
            <h2 className="text-lg font-bold text-gray-800">{produto.nome}</h2>
            <p className="text-2xl font-black text-green-600 mt-2">R$ {produto.preco.toFixed(2)}</p>
            <button className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg font-semibold italic">
              VER DETALHES
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Produto */}
      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-8 relative overflow-y-auto max-h-[95vh] shadow-2xl">
            <button 
              onClick={() => {setProdutoSelecionado(null); setFrete(null);}} 
              className="absolute top-6 right-6 text-3xl font-light hover:rotate-90 transition-transform"
            >✕</button>
            
            <div className="flex flex-col md:flex-row gap-10">
              {/* Lado Esquerdo: Imagem */}
              <div className="flex-1 relative h-[450px] bg-gray-50 rounded-2xl">
                <Image 
                  src={produtoSelecionado.imagem_url} 
                  alt={produtoSelecionado.nome} 
                  fill 
                  className="object-contain p-4" 
                />
              </div>
              
              {/* Lado Direito: Info e Botão */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{produtoSelecionado.nome}</h2>
                  <p className="text-4xl font-black text-green-600 mt-2">R$ {produtoSelecionado.preco.toFixed(2)}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-2">Descrição</h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {produtoSelecionado.descricao || "Acabamento premium, conforto e estilo para o seu dia a dia."}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-700">Calcular Frete:</label>
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
                    <p className="text-green-700 font-bold flex items-center gap-2">
                      <span>🚚</span> Chega em até 7 dias úteis por R$ {frete.toFixed(2)}
                    </p>
                  )}
                </div>

                <button 
                  onClick={handleFinalizarNoSite}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "PROCESSANDO..." : "FINALIZAR NO SITE"}
                </button>
                <p className="text-center text-xs text-gray-400">Pagamento seguro via Mercado Pago</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}