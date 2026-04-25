import React from 'react'
import { ShieldCheck, Mail, Layers } from 'lucide-react'
import { useProduct } from '../context/ProductContext'

export default function ProductSwitch({ className = '' }) {
  const { product, setProduct } = useProduct()

  return (
    <div
      className={`flex items-center gap-0.5 p-1 rounded-xl ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <button
        onClick={() => setProduct('all')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          product === 'all' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
        }`}
        style={
          product === 'all'
            ? { background: 'linear-gradient(135deg, #7C3AED, #4C1D95)', boxShadow: '0 2px 8px rgba(124,58,237,0.4)' }
            : {}
        }
      >
        <Layers className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">All</span>
      </button>
      <button
        onClick={() => setProduct('sase')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          product === 'sase' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
        }`}
        style={
          product === 'sase'
            ? { background: 'linear-gradient(135deg, #2C6A8A, #1F5070)', boxShadow: '0 2px 8px rgba(44,106,138,0.4)' }
            : {}
        }
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Forti SASE</span>
      </button>
      <button
        onClick={() => setProduct('perception')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          product === 'perception' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
        }`}
        style={
          product === 'perception'
            ? { background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 2px 8px rgba(5,150,105,0.4)' }
            : {}
        }
      >
        <Mail className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Perception Point</span>
      </button>
    </div>
  )
}
