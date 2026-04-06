import "./style.css";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Via Prime Shopping',
  description: 'Excelência em cada detalhe',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        {children}

        {/* BOTÃO DO WHATSAPP VIA PRIME */}
        <a
          href="https://wa.me/5514981781495?text=Olá%20Via%20Prime!%20Gostaria%20de%20saber%20mais%20sobre%20este%20produto."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#25d366',
            color: '#fff',
            borderRadius: '50px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
            alt="WhatsApp" 
            style={{ width: '25px', height: '25px' }} 
          />
          Falar com a Via Prime
        </a>
      </body>
    </html>
  )
}
