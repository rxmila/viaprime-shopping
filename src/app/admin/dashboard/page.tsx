'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // ESTADOS DO FORMULÁRIO (PADRÃO VIA PRIME)
  const [newName, setNewName] = useState('')
  const [newBrand, setNewBrand] = useState('Via Prime')
  const [newModel, setNewModel] = useState('')
  const [newSKU, setNewSKU] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newSizes, setNewSizes] = useState('') 
  const [newColors, setNewColors] = useState('') 
  // NOVO ESTADO: Lista de imagens para variações
  const [newVariationsImages, setNewVariationsImages] = useState('') 
  const [newShippingDeadline, setNewShippingDeadline] = useState('7 dias úteis') 
  const [freeShipping, setFreeShipping] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false })
    if (data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    setIsAdding(true)
    const { error } = await supabase.from('products').insert([{ 
      name: newName, model: newModel, sku: newSKU, brand: newBrand,
      price: parseFloat(newPrice), image_url: newImage, 
      description: newDescription, shipping_deadline: newShippingDeadline,
      sizes: newSizes, colors: newColors, 
      // Salva a lista de imagens das cores
      variations_images: newVariationsImages, 
      free_shipping: freeShipping
    }])

    if (!error) {
      setNewName(''); setNewModel(''); setNewSKU(''); setNewPrice(''); 
      setNewImage(''); setNewSizes(''); setNewColors(''); setNewVariationsImages('');
      fetchProducts()
    } else { alert("Erro: " + error.message) }
    setIsAdding(false)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f0f2f5' }}>
      <header style={{ backgroundColor: '#0086ff', color: 'white', padding: '15px 25px', borderRadius: '12px', marginBottom: '25px' }}>
        <h1 style={{ margin: 0, fontSize: '1.3rem' }}>VIA PRIME | Console de Vendedor</h1>
      </header>

      {/* FORMULÁRIO DE CADASTRO */}
      <section style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', color: '#0086ff' }}>Cadastrar Novo Produto</h2>
        
        <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
          <input placeholder="Título Comercial (Ex: Bota Cano Médio)" value={newName} onChange={(e) => setNewName(e.target.value)} required style={{ ...inputStyle, gridColumn: 'span 2' }} />
          <input placeholder="Modelo" value={newModel} onChange={(e) => setNewModel(e.target.value)} required style={inputStyle} />
          <input placeholder="SKU" value={newSKU} onChange={(e) => setNewSKU(e.target.value)} required style={inputStyle} />
          <input placeholder="Marca" value={newBrand} onChange={(e) => setNewBrand(e.target.value)} required style={inputStyle} />
          <input placeholder="Preço (R$)" type="number" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required style={inputStyle} />
          <input placeholder="Link da Imagem Principal" value={newImage} onChange={(e) => setNewImage(e.target.value)} required style={{ ...inputStyle, gridColumn: 'span 2' }} />
          <input placeholder="Cores (Ex: Caramelo, Preto)" value={newColors} onChange={(e) => setNewColors(e.target.value)} required style={inputStyle} />
          <input placeholder="Tamanhos (Ex: 34, 35, 36)" value={newSizes} onChange={(e) => setNewSizes(e.target.value)} required style={inputStyle} />

          {/* NOVO CAMPO DE IMAGENS DE VARIAÇÃO */}
          <textarea 
            placeholder="Links das Imagens das Cores (Ex: link_caramelo.jpg, link_preto.jpg)" 
            value={newVariationsImages} 
            onChange={(e) => setNewVariationsImages(e.target.value)} 
            style={{ ...inputStyle, gridColumn: 'span 4', height: '60px' }} 
          />

          <textarea placeholder="Descrição Completa do Produto..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} style={{ ...inputStyle, gridColumn: 'span 4', height: '100px' }} />

          <div style={{ gridColumn: 'span 4', textAlign: 'right' }}>
            <button type="submit" disabled={isAdding} style={buttonStyle}>
              {isAdding ? 'Sincronizando...' : 'SALVAR E PUBLICAR ANÚNCIO'}
            </button>
          </div>
        </form>
      </section>

      {/* LISTAGEM PARA CONFERÊNCIA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {products.map((p) => (
          <div key={p.id} style={cardStyle}>
            <div style={{ padding: '8px', fontSize: '0.65rem', color: '#888', borderBottom: '1px solid #eee' }}>
              SKU: {p.sku} | Marca: {p.brand}
            </div>
            <img src={p.image_url} style={{ width: '100%', height: '180px', objectFit: 'contain' }} />
            <div style={{ padding: '15px' }}>
              <h3 style={{ fontSize: '0.85rem', margin: '0 0 10px 0', height: '35px', overflow: 'hidden' }}>{p.name}</h3>
              <p style={{ color: '#0086ff', fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>R$ {Number(p.price).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box' as 'border-box' }
const buttonStyle = { padding: '12px 30px', backgroundColor: '#0086ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as 'bold' }
const cardStyle = { backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }