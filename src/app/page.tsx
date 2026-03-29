'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Inicialização do cliente Supabase
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
  const [selectedColor, setSelectedColor] = useState('')
  const [displayImage, setDisplayImage] = useState<string>('')

  // Carregar produtos do Banco de Dados
  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('products').select('*').order('id', { ascending: false })
      if (data) setProducts(data)
    }
    load()
  }, [])

  // Troca a cor e a imagem de variação baseada na ordem (index)
  const handleColorSelect = (colorName: string, index: number) => {
    setSelectedColor(colorName);
    
    if (selectedProduct?.variations_images) {
      const imagesList = selectedProduct.variations_images.split(',').map((img: string) => img.trim());
      
      if (imagesList[index] && imagesList[index].startsWith('http')) {
        setDisplayImage(imagesList[index]);
      } else {
        setDisplayImage(selectedProduct.image_url);
      }
    }
  };

  // Reseta estados quando abre um novo produto
  useEffect(() => {
    if (selectedProduct) {
      setDisplayImage(selectedProduct.image_url || '');
      setSelectedColor('');
      setSelectedSize('');
      setFreteResult(null);
    }
  }, [selectedProduct]);

  const calcularFrete = () => {
    if (cep.length < 5) return alert("Digite um CEP válido")
    const valor = 15.90 + (Number(selectedProduct?.weight_grams || 500) * 0.01)
    setFreteResult({ 
      valor: valor.toFixed(2), 
      prazo: selectedProduct?.shipping_deadline || '7 dias úteis' 
    })
  }

  // Função para simular o início do pagamento no site
  const irParaPagamento = () => {
    alert(`Iniciando Checkout Seguro...\nProduto: ${selectedProduct.name}\nCor: ${selectedColor}\nTamanho: ${selectedSize}\n\nConectando ao gateway de pagamento...`);
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily: 'sans-serif', paddingBottom: '80px' }}>
      
      {/* HEADER */}
      <header style={{ backgroundColor: '#0086ff', padding: '20px', color: 'white', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '1px' }}>VIA PRIME | MARKETPLACE</h1>
      </header>

      {/* VITRINE DE PRODUTOS */}
      <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
        {products.map(p => (
          <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', cursor: 'pointer', textAlign: 'center', transition: '0.2s', border: '1px solid #eee' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '220px', objectFit: 'contain' }} />
            <h3 style={{ fontSize: '0.9rem', margin: '15px 0 10px', color: '#333' }}>{p.name}</h3>
            <p style={{ color: '#0086ff', fontWeight: 'bold', fontSize: '1.3rem' }}>R$ {Number(p.price).toFixed(2)}</p>
          </div>
        ))}
      </main>

      {/* MODAL DE DETALHES E COMPRA */}
      {selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', maxWidth: '1000px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            
            <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#eee', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            
            {/* ESQUERDA: IMAGEM DINÂMICA E TEXTO */}
            <div style={{ flex: '1', minWidth: '320px' }}>
              <img src={displayImage} alt="Preview" style={{ width: '100%', borderRadius: '15px', objectFit: 'contain', minHeight: '350px', backgroundColor: '#f9f9f9' }} />
              
              <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#f8fbff', borderRadius: '12px', borderLeft: '5px solid #0086ff' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333' }}>Descrição Premium</h4>
                <p style={{ fontSize: '0.85rem', color: '#555', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {selectedProduct.description || "Este item exclusivo Via Prime combina materiais de alta durabilidade com design sofisticado."}
                </p>
              </div>
            </div>

            {/* DIREITA: SELEÇÃO E CHECKOUT */}
            <div style={{ flex: '1', minWidth: '320px' }}>
              <span style={{ color: '#0086ff', fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase' }}>{selectedProduct.brand || 'Original Via Prime'}</span>
              <h2 style={{ fontSize: '1.8rem', margin: '10px 0', color: '#222' }}>{selectedProduct.name}</h2>
              
              <div style={{ margin: '20px 0' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0086ff' }}>R$ {Number(selectedProduct.price).toFixed(2)}</span>
                <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#777' }}>Disponível em 10x sem juros no cartão</p>
              </div>

              {/* CORES DINÂMICAS */}
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '12px' }}>Selecione a Cor:</p>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {(selectedProduct.colors || "Única").split(',').map((color: string, index: number) => (
                  <button 
                    key={index} 
                    onClick={() => handleColorSelect(color.trim(), index)} 
                    style={{ 
                      padding: '12px 20px', 
                      border: selectedColor === color.trim() ? '2px solid #0086ff' : '1px solid #ddd', 
                      borderRadius: '8px', 
                      backgroundColor: selectedColor === color.trim() ? '#eef6ff' : 'white',
                      cursor: 'pointer',
                      fontWeight: selectedColor === color.trim() ? 'bold' : 'normal'
                    }}
                  >
                    {color.trim()}
                  </button>
                ))}
              </div>

              {/* TAMANHOS */}
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '12px' }}>Tamanho Disponível:</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
                {(selectedProduct.sizes || "").split(/[ ,;]+/).map((s: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedSize(s.trim())}
                    style={{ 
                      width: '48px', height: '48px', 
                      border: selectedSize === s.trim() ? '2px solid #0086ff' : '1px solid #ddd', 
                      borderRadius: '8px', 
                      backgroundColor: selectedSize === s.trim() ? '#eef6ff' : 'white',
                      cursor: 'pointer'
                    }}
                  >
                    {s.trim()}
                  </button>
                ))}
              </div>

              {/* SIMULADOR DE FRETE */}
              <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input placeholder="Seu CEP" value={cep} onChange={(e) => setCep(e.target.value)} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', flex: 1 }} />
                  <button onClick={calcularFrete} style={{ backgroundColor: '#333', color: 'white', padding: '12px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Calcular</button>
                </div>
                {freteResult && <p style={{ marginTop: '15px', color: '#2ecc71', fontWeight: 'bold' }}>🚚 Chega em {freteResult.prazo} por R$ {freteResult.valor}</p>}
              </div>

              {/* BOTÃO DE CHECKOUT NO SITE */}
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
                  cursor: (selectedSize && selectedColor) ? 'pointer' : 'not-allowed',
                  boxShadow: (selectedSize && selectedColor) ? '0 4px 15px rgba(46, 204, 113, 0.3)' : 'none'
                }}
                onClick={irParaPagamento}
              >
                {(selectedSize && selectedColor) ? 'FINALIZAR NO SITE' : 'SELECIONE COR E TAMANHO'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTÃO FLUTUANTE WHATSAPP (APENAS PARA DÚVIDAS) */}
      <a 
        href="https://wa.me/5514981781495?text=Olá, tenho uma dúvida sobre um produto da Via Prime" 
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: '25px', right: '25px', 
          backgroundColor: '#25d366', color: 'white', 
          width: '65px', height: '65px', borderRadius: '50%', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)', zIndex: 10000, 
          textDecoration: 'none', fontSize: '30px'
        }}
      >
        <span role="img" aria-label="WhatsApp">💬</span>
      </a>

    </div>
  )
}