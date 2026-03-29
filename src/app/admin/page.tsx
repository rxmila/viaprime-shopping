'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function VitrineVendas() {
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [cep, setCep] = useState('')
  const [freteResult, setFreteResult] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('') // Estado para cor selecionada

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('*').order('id', { ascending: false })
      if (data) setProducts(data)
    }
    load()
  }, [])

  const calcularFrete = () => {
    if (cep.length < 5) return alert("Digite um CEP válido")
    // Cálculo simulado baseado em peso técnico
    const valor = 15.90 + (Number(selectedProduct.weight_grams || 500) * 0.01)
    setFreteResult({ 
      valor: valor.toFixed(2), 
      prazo: selectedProduct.shipping_deadline || '7 dias úteis' 
    })
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* HEADER ESTILO VIA PRIME */}
      <header style={{ backgroundColor: '#0086ff', padding: '20px', color: 'white', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>VIA PRIME | MARKETPLACE</h1>
      </header>

      {/* GRID DE PRODUTOS */}
      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
        {products.map(p => (
          <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <img src={p.image_url} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
            <h3 style={{ fontSize: '0.95rem', color: '#333', marginTop: '15px' }}>{p.name}</h3>
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0086ff' }}>R$ {Number(p.discount_price || p.price).toFixed(2)}</p>
          </div>
        ))}
      </main>

      {/* MODAL DE PRODUTO (REESTRUTURADO) */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', maxWidth: '1000px', width: '100%', maxHeight: '95vh', overflowY: 'auto', position: 'relative', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            
            <button onClick={() => { setSelectedProduct(null); setFreteResult(null); setSelectedSize(''); setSelectedColor(''); }} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#eee', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            
            {/* COLUNA 1: VISUAL E DESCRIÇÃO */}
            <div style={{ flex: '1', minWidth: '350px' }}>
              <img src={selectedProduct.image_url} style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
              
              {/* CAMPO DE TEXTO PERSUASIVO */}
              <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px', borderLeft: '5px solid #0086ff' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Detalhes do Produto</h4>
                <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {selectedProduct.description || "Design exclusivo Via Prime, unindo elegância e conforto absoluto."}
                </p>
              </div>
            </div>

            {/* COLUNA 2: ESPECIFICAÇÕES E SELEÇÃO */}
            <div style={{ flex: '1', minWidth: '350px' }}>
              <p style={{ fontSize: '0.8rem', color: '#0086ff', fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>{selectedProduct.brand}</p>
              <h2 style={{ fontSize: '1.8rem', margin: '10px 0' }}>{selectedProduct.name}</h2>
              <p style={{ fontSize: '0.8rem', color: '#999' }}>SKU: {selectedProduct.sku}</p>

              <div style={{ margin: '25px 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0086ff' }}>R$ {Number(selectedProduct.discount_price || selectedProduct.price).toFixed(2)}</span>
                <p style={{ margin: '5px 0', color: '#666' }}>ou {selectedProduct.max_installments}x de R$ {(Number(selectedProduct.discount_price || selectedProduct.price) / selectedProduct.max_installments).toFixed(2)}</p>
              </div>

              {/* SELETOR DE CORES (Vindo do Banco) */}
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '12px' }}>Escolha a Cor:</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {(selectedProduct.colors || "Única").split(/[ ,;]+/).map((color: string) => (
                  <button 
                    key={color} 
                    onClick={() => setSelectedColor(color.trim())}
                    style={{ 
                      padding: '10px 18px', 
                      border: selectedColor === color.trim() ? '2px solid #0086ff' : '1px solid #ddd', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      backgroundColor: selectedColor === color.trim() ? '#eef6ff' : 'white',
                      fontWeight: selectedColor === color.trim() ? 'bold' : 'normal'
                    }}
                  >
                    {color.trim()}
                  </button>
                ))}
              </div>

              {/* SELETOR DE TAMANHO (GRADE) */}
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '12px' }}>Escolha o Tamanho:</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
                {(selectedProduct.sizes || "").split(/[ ,;]+/).map((s: string) => (
                  <button 
                    key={s} 
                    onClick={() => setSelectedSize(s.trim())}
                    style={{ 
                      width: '50px', height: '50px', 
                      border: selectedSize === s.trim() ? '2px solid #0086ff' : '1px solid #ddd', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      backgroundColor: selectedSize === s.trim() ? '#eef6ff' : 'white'
                    }}
                  >
                    {s.trim()}
                  </button>
                ))}
              </div>

              {/* SIMULADOR DE FRETE */}
              <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input placeholder="CEP (00000-000)" value={cep} onChange={(e) => setCep(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 }} />
                  <button onClick={calcularFrete} style={{ padding: '12px 20px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Calcular</button>
                </div>
                {freteResult && <p style={{ marginTop: '15px', color: '#2ecc71', fontWeight: 'bold', fontSize: '0.95rem' }}>🚚 Frete: R$ {freteResult.valor} — {freteResult.prazo}</p>}
              </div>

              {/* BOTÃO DE COMPRA DINÂMICO */}
              <button 
                disabled={!selectedSize || !selectedColor}
                style={{ 
                  width: '100%', 
                  padding: '22px', 
                  backgroundColor: (selectedSize && selectedColor) ? '#2ecc71' : '#ccc', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontWeight: 'bold', 
                  fontSize: '1.2rem', 
                  cursor: (selectedSize && selectedColor) ? 'pointer' : 'not-allowed' 
                }}
                onClick={() => alert(`Pedido: ${selectedProduct.name}\nCor: ${selectedColor}\nTamanho: ${selectedSize}`)}
              >
                {(selectedSize && selectedColor) ? 'COMPRAR AGORA' : 'SELECIONE COR E TAMANHO'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}