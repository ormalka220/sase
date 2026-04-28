import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function DarkTable({
  columns = [],
  data = [],
  onRowClick = null,
  sortable = false,
  onSort = null,
  hoverable = true,
  striped = false,
  compact = false,
  className = ''
}) {
  const [sortConfig, setSortConfig] = useState(null)

  const handleSort = (columnKey) => {
    if (!sortable) return
    
    let direction = 'asc'
    if (sortConfig?.key === columnKey && sortConfig?.direction === 'asc') {
      direction = 'desc'
    }
    
    setSortConfig({ key: columnKey, direction })
    onSort?.(columnKey, direction)
  }

  const sortedData = sortable && sortConfig 
    ? [...data].sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
        }
        
        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()
        return sortConfig.direction === 'asc' 
          ? aStr.localeCompare(bStr) 
          : bStr.localeCompare(aStr)
      })
    : data

  return (
    <div className={`glass rounded-xl border border-white/10 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${
                    col.sortable !== false && sortable ? 'cursor-pointer hover:text-slate-300' : ''
                  }`}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{ width: col.width }}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortable && col.sortable !== false && (
                      <div>
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-3 h-3 text-cdata-400" />
                          ) : (
                            <ChevronDown className="w-3 h-3 text-cdata-400" />
                          )
                        ) : (
                          <div className="w-3 h-3 opacity-0" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="text-sm text-slate-500">No data available</div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <motion.tr
                  key={idx}
                  className={`transition-all ${
                    hoverable ? 'hover:bg-white/[0.03] cursor-pointer' : ''
                  } ${striped && idx % 2 === 0 ? 'bg-white/[0.01]' : ''} ${compact ? '' : 'h-14'}`}
                  onClick={() => onRowClick?.(row)}
                  whileHover={hoverable ? { backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
                >
                  {columns.map((col) => (
                    <td key={`${idx}-${col.key}`} className="px-6 py-4">
                      {col.render ? (
                        col.render(row[col.key], row)
                      ) : (
                        <div className="text-sm text-slate-300">
                          {typeof row[col.key] === 'object' 
                            ? JSON.stringify(row[col.key])
                            : row[col.key]
                          }
                        </div>
                      )}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
