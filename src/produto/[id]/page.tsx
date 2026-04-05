'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PaginaProduto({ params }: { params: { id: string } }) {
  const [tamanho, setTamanho] = useState('');
  const [cor, setCor] = useState('');

  // Simulação de dados (Em breve vindo do Supabase)
  const produto = {
    nome: "Produto Selecionado",
    preco: 239.90,
    tamanhos: [34, 35, 36, 37, 38, 39, 40],
    cores: ["Padrão", "Variante"],
    descricao: "Detalhes premium com acabamento exclusivo ViaPrime."
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 bg-white min-h-screen">
      <Link href="/" className="text-blue-600 font-bold mb-8 block">← Voltar para a loja</Link>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-slate-100 rounded-2xl h-[500px] flex items-center justify-center text-slate-400">
          [Imagem do Produto]
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">{produto.nome}</h1>
          <p className="text-4xl font-black text-blue-600">R$ {produto.preco.toFixed(2)}</p>
          
          <div className="space-y-4">
            <p className="font-bold text-sm uppercase text-slate-500">Tamanho:</p>
            <div className="flex flex-wrap gap-2">
              {produto.tamanhos.map(t => (
                <button key={t} onClick={() => setTamanho(t.toString())} className={`border p-3 rounded-md ${tamanho === t.toString() ? 'bg-blue-600 text-white' : ''}`}>{t}</button>
              ))}
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold uppercase">Adicionar ao Carrinho</button>
        </div>
      </div>
    </div>
  );
}