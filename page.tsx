"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// Conexão com o Supabase (Usando as variáveis que você já configurou na Vercel)
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

  // 1. Busca os produtos no Banco de Dados
  useEffect(() => {
    async function carregarProdutos() {
      const { data } = await supabase.from('produtos').select('*');
      if (data) setProdutos(data);
    }
    carregarProdutos();
  }, []);

  // 2. Função para Calcular Frete (Simulação fixa baseada no seu print)
  const calcularFrete = () => {
    if (cep.length === 8) {
      setFrete(20.90);
    } else {
      alert("Digite um CEP válido com 8 dígitos.");
    }
  };

  // 3. A PONTE COM O MERCADO PAGO (O que substitui o "OK")
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
          shipping: frete || 20.90, // Usa o frete calculado ou o padrão de 20.90
        }),
      });

      const data = await response.json();

      if (data.init_point) {
        // Redireciona para a tela oficial de pagamento do Mercado Pago
        window.location.href = data.init_point;
      } else {
        alert("Erro ao gerar link de pagamento. Verifique as chaves na Vercel.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão com o gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-12 text-blue-900">Via Prime - Vitrine Exclusiva</h1>

      {/* Grade de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {produtos.map((produto) => (
          <div 
            key={produto.id} 
            className="bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setProdutoSelecionado(produto)}
          )
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
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-medium">
              Ver Detalhes
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Detalhes (O que aparece no seu print) */}
      {produtoSelecionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button 
              onClick={() => {setProdutoSelecionado(null); setFrete(null);}}
              className="absolute top-4 right-4 text-2xl"
            >✕</button>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Imagem do Produto */}
              <div className="flex-1 relative h-[400px]">
                <Image 
                  src={produtoSelecionado.imagem_url} 
                  alt={produtoSelecionado.nome} 
                  fill 
                  className="object-contain"
                />
              </div>

              {/* Informações e Compra */}
              <div className="flex-1 space-y-6">
                <h2 className="text-2xl font-bold">{produtoSelecionado.nome}</h2>
                <p className="text-3xl text-green-600 font-bold">R$ {produtoSelecionado.preco.toFixed(2)}</p>
                
                <div className="bg-gray-100 p-4 rounded-lg text-sm">
                  <h3 className="font-bold mb-2">Descrição Premium</h3>
                  <p>{produtoSelecionado.descricao || "Produto de alta qualidade em couro napa."}</p>
                </div>

                {/* Seção de Frete */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Seu CEP (ex: 18732204)" 
                      className="border p-2 rounded flex-1"
                      value={cep}
                      onChange={(e) => setCev(e.target.value)}
                    />
                    <button 
                      onClick={calcularFrete}
                      className="bg-gray-800 text-white px-4 py-2 rounded"
                    >Calcular</button>
                  </div>
                  {frete && (
                    <p className="text-green-700 font-medium">🚚 Chega em 7 dias úteis por R$ {frete.toFixed(2)}</p>
                  )}
                </div>

                {/* O BOTÃO QUE ABRE O MERCADO PAGO */}
                <button 
                  onClick={handleFinalizarNoSite}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 rounded-xl shadow-lg transition-colors"
                >
                  {loading ? "CONECTANDO..." : "FINALIZAR NO SITE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}