'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PaginaProduto({ params }: { params: { id: string } }) {
  const [tamanho, setTamanho] = useState('');
  const [cor, setCor] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  // Aqui simulamos o que viria do seu Supabase baseado no ID
  const produto = {
    nome: "Sandália Plataforma de Cunha Anabela",
    preco: 239.90,
    descricao: "Conforto e elegância para o seu dia a dia. Salto anabela macio com acabamento premium.",
    tamanhos: [34, 35, 36, 37, 38, 39, 40],
    cores: ["Caramelo", "Nude", "Preto"],
    imagem: "/sandalia.jpg" // Use o caminho da sua imagem
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 grid md:grid-cols-2 gap-8 bg-white min-h-screen">
      {/* Lado Esquerdo: Imagem */}
      <div className="relative h-[400px] md:h-[600px] border rounded-xl overflow-hidden">
        <Image 
          src={produto.imagem} 
          alt={produto.nome} 
          fill 
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Lado Direito: Informações e Escolhas */}
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-slate-800">{produto.nome}</h1>
        <p className="text-4xl font-extrabold text-blue-600">R$ {produto.preco.toFixed(2)}</p>
        
        <div className="border-t border-b py-4">
          <p className="text-slate-600 leading-relaxed">{produto.descricao}</p>
        </div>

        {/* Seleção de Tamanho */}
        <div>
          <label className="block font-bold mb-2 uppercase text-xs text-slate-500">Selecione o Tamanho:</label>
          <div className="flex flex-wrap gap-2">
            {produto.tamanhos.map((t) => (
              <button
                key={t}
                onClick={() => setTamanho(t.toString())}
                className={`px-4 py-2 border rounded-md transition-all ${tamanho === t.toString() ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Seleção de Cor */}
        <div>
          <label className="block font-bold mb-2 uppercase text-xs text-slate-500">Selecione a Cor:</label>
          <div className="flex gap-2">
            {produto.cores.map((c) => (
              <button
                key={c}
                onClick={() => setCor(c)}
                className={`px-4 py-2 border rounded-md transition-all ${cor === c ? 'bg-slate-800 text-white' : 'bg-white hover:border-slate-400'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Quantidade e Carrinho */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button onClick={() => setQuantidade(q => Math.max(1, q - 1))} className="px-4 py-2 bg-slate-100">-</button>
            <span className="px-6 font-bold">{quantidade}</span>
            <button onClick={() => setQuantidade(q => q + 1)} className="px-4 py-2 bg-slate-100">+</button>
          </div>
          
          <button 
            className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors uppercase tracking-widest text-sm"
            onClick={() => alert(`Adicionado: ${produto.nome}, Tamanho ${tamanho}, Cor ${cor}`)}
          >
            Adicionar ao Carrinho 🛍️
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-2">💳 Ambiente Seguro Mercado Pago</p>
      </div>
    </div>
  );
}