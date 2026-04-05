"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (Usando suas variáveis de ambiente da Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function VitrineViaPrime() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para o cálculo de Frete
  const [cep, setCep] = useState('');
  const [freteResultado, setFreteResultado] = useState<{ valor: string, prazo: string } | null>(null);
  const [carregandoFrete, setCarregandoFrete] = useState(false);

  // Busca produtos reais do seu banco de dados Supabase
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Erro ao buscar produtos:', error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Função de Cálculo de Frete (Simulação Profissional pré-API)
  const calcularFrete = async () => {
    if (cep.length < 8) {
      alert("Por favor, digite um CEP válido (8 dígitos).");
      return;
    }
    setCarregandoFrete(true);
    
    // Simula o tempo de resposta das transportadoras para o cliente ver o "Carregando"
    setTimeout(() => {
      setFreteResultado({ valor: "18,90", prazo: "5 a 8 dias úteis" });
      setCarregandoFrete(false);
    }, 1200);
  };

  // Tela de Carregamento Inicial
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-20 border-t-blue-600"></div>
          <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Carregando ViaPrime...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] pb-20">
      {/* Header Profissional */}
      <header className="bg-white border-b border-gray-100 py-6 mb-8 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">
            VIA<span className="text-blue-600">PRIME</span><span className="text-gray-400 not-italic font-light">SHOPPING</span>
          </h1>
        </div>
      </header>

      {/* Grid de Produtos */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product) => (
          <div key={product.id} className="group bg-white rounded-[40px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,118,255,0.08)] transition-all duration-500 border border-gray-50">
            
            {/* Container da Imagem */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] shadow-sm">
                  Coleção 2026
                </span>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-8">
              <div className="mb-2 flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
              </div>
              
              <div className="flex flex-col mb-8">
                <span className="text-3xl font-black text-gray-900 leading-none">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mt-2">
                  Preço exclusivo no Pix
                </span>
              </div>

              {/* Módulo de Frete Inteligente */}
              <div className="mb-8 p-6 bg-gray-50 rounded-[30px] border border-gray-100 transition-all">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-4">Simular Frete e Prazo</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Seu CEP" 
                    maxLength={8}
                    className="flex-1 bg-white px-5 py-4 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none text-sm font-bold transition-all shadow-sm"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, ''))}
                  />
                  <button 
                    onClick={calcularFrete}
                    disabled={carregandoFrete}
                    className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all disabled:bg-gray-200"
                  >
                    {carregandoFrete ? "..." : "OK"}
                  </button>
                </div>

                {freteResultado && !carregandoFrete && (
                  <div className="mt-5 flex items-center gap-4 bg-white p-4 rounded-2xl border border-green-50 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="text-2xl">📦</div>
                    <div>
                      <p className="text-[10px] font-black text-green-500 uppercase tracking-tighter">Chegará em {freteResultado.prazo}</p>
                      <p className="text-sm font-black text-gray-900">R$ {freteResultado.valor}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Botão de Compra - Estilo "Confiança Total" */}
              <button className="w-full bg-blue-600 text-white py-6 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group">
                Finalizar Compra
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
                <div className="h-[1px] w-8 bg-gray-400"></div>
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Ambiente Seguro Mercado Pago</span>
                <div className="h-[1px] w-8 bg-gray-400"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}