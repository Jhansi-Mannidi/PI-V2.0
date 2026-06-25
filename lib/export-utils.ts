'use client'

import { toast } from 'sonner'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// Types for export functionality
export interface ExportOptions {
  filename: string
  title: string
  data?: Record<string, unknown>[]
  headers?: string[]
}

// Generate CSV content from data
export function generateCSV(data: Record<string, unknown>[], headers?: string[]): string {
  if (!data || data.length === 0) return ''
  
  const keys = headers || Object.keys(data[0])
  const csvHeaders = keys.join(',')
  const csvRows = data.map(row => 
    keys.map(key => {
      const value = row[key]
      // Escape quotes and wrap in quotes if contains comma
      const strValue = String(value ?? '')
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`
      }
      return strValue
    }).join(',')
  )
  
  return [csvHeaders, ...csvRows].join('\n')
}

// Download file utility
export function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export to CSV
export function exportToCSV(options: ExportOptions) {
  const { filename, data, headers } = options
  
  if (!data || data.length === 0) {
    toast.error('No data to export')
    return
  }
  
  const csvContent = generateCSV(data, headers)
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;')
  toast.success(`Downloaded ${filename}.csv`)
}

// Export to PDF - generates actual PDF file download
export function exportToPDF(options: ExportOptions) {
  const { filename, title, data } = options
  
  try {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPos = 20
    
    // Add header with gold accent
    doc.setFillColor(184, 134, 11) // Gold color
    doc.rect(0, 0, pageWidth, 25, 'F')
    
    // Title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(title, margin, 16)
    
    yPos = 35
    
    // Subtitle / metadata
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos)
    doc.text(`ODC Capital Portfolio`, pageWidth - margin - 40, yPos)
    
    yPos += 15
    
    // Draw separator line
    doc.setDrawColor(184, 134, 11)
    doc.setLineWidth(0.5)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    yPos += 10
    
    // Extract content from page
    const mainContent = document.querySelector('main')
    
    if (mainContent) {
      // Extract KPI cards
      const kpiCards = mainContent.querySelectorAll('[class*="kpi"], [class*="metric"], [class*="stat"]')
      if (kpiCards.length > 0) {
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(31, 41, 55)
        doc.text('Key Metrics', margin, yPos)
        yPos += 8
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        kpiCards.forEach((card) => {
          const text = card.textContent?.trim().replace(/\s+/g, ' ').substring(0, 80)
          if (text && yPos < 270) {
            doc.text(`• ${text}`, margin + 5, yPos)
            yPos += 6
          }
        })
        
        yPos += 10
      }
      
      // Extract section headers and content
      const sections = mainContent.querySelectorAll('h2, h3, section')
      sections.forEach((section) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        
        const tagName = section.tagName.toLowerCase()
        if (tagName === 'h2' || tagName === 'h3') {
          const text = section.textContent?.trim().substring(0, 60)
          if (text) {
            doc.setFontSize(tagName === 'h2' ? 14 : 12)
            doc.setFont('helvetica', 'bold')
            doc.setTextColor(31, 41, 55)
            doc.text(text, margin, yPos)
            yPos += tagName === 'h2' ? 10 : 8
          }
        }
      })
    }
    
    // Add data table if provided
    if (data && data.length > 0) {
      const headers = Object.keys(data[0])
      const rows = data.map(row => headers.map(h => String(row[h] ?? '')))
      
      if (yPos > 200) {
        doc.addPage()
        yPos = 20
      }
      
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: yPos,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [11, 31, 58], // Navy
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [247, 249, 252],
        },
      })
    }
    
    // Add footer to all pages
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Page ${i} of ${pageCount} | ${filename}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }
    
    // Download the PDF
    doc.save(`${filename}.pdf`)
    toast.success(`Downloaded ${filename}.pdf`)
    
  } catch (error) {
    console.error('PDF export error:', error)
    toast.error('Failed to generate PDF. Please try again.')
  }
}

// Export to Slides (generates presentation-style PDF)
export function exportToSlides(options: ExportOptions) {
  const { filename, title } = options
  
  try {
    // Create landscape PDF for slides
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })
    
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    
    // Title slide
    doc.setFillColor(11, 31, 58) // Navy background
    doc.rect(0, 0, pageWidth, pageHeight, 'F')
    
    // Gold accent bar
    doc.setFillColor(184, 134, 11)
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F')
    
    // Title
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(36)
    doc.setFont('helvetica', 'bold')
    doc.text(title, pageWidth / 2, pageHeight / 2 - 10, { align: 'center' })
    
    // Subtitle
    doc.setFontSize(16)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(184, 134, 11)
    doc.text('ODC Capital Portfolio', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' })
    
    // Date
    doc.setFontSize(12)
    doc.setTextColor(200, 200, 200)
    doc.text(
      new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      pageWidth / 2,
      pageHeight / 2 + 25,
      { align: 'center' }
    )
    
    // Add content slides from page sections
    const mainContent = document.querySelector('main')
    if (mainContent) {
      const sections = mainContent.querySelectorAll('section, [data-section], .card')
      let slideCount = 0
      
      sections.forEach((section) => {
        if (slideCount >= 8) return // Limit slides
        
        const headerEl = section.querySelector('h2, h3')
        const header = headerEl?.textContent?.trim()
        if (!header) return
        
        doc.addPage()
        slideCount++
        
        // Slide background
        doc.setFillColor(247, 249, 252)
        doc.rect(0, 0, pageWidth, pageHeight, 'F')
        
        // Header bar
        doc.setFillColor(11, 31, 58)
        doc.rect(0, 0, pageWidth, 25, 'F')
        
        // Slide title
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.text(header.substring(0, 50), 20, 16)
        
        // Slide number
        doc.setFontSize(10)
        doc.setTextColor(184, 134, 11)
        doc.text(`${slideCount + 1}`, pageWidth - 20, 16)
        
        // Content excerpt
        const content = section.textContent?.replace(header, '').trim().substring(0, 500)
        if (content) {
          doc.setTextColor(31, 41, 55)
          doc.setFontSize(12)
          doc.setFont('helvetica', 'normal')
          
          const lines = doc.splitTextToSize(content, pageWidth - 40)
          doc.text(lines.slice(0, 12), 20, 45)
        }
      })
    }
    
    // Download
    doc.save(`${filename}-slides.pdf`)
    toast.success(`Downloaded ${filename}-slides.pdf`)
    
  } catch (error) {
    console.error('Slides export error:', error)
    toast.error('Failed to generate slides. Please try again.')
  }
}

// Copy share link
export function copyShareLink(reportPath: string) {
  const url = `${window.location.origin}${reportPath}`
  navigator.clipboard.writeText(url).then(() => {
    toast.success('Link copied to clipboard')
  }).catch(() => {
    toast.error('Failed to copy link')
  })
}

// Export to XLSX (generates actual Excel file)
export function exportToXLSX(options: ExportOptions) {
  const { filename, title, data, headers } = options
  
  if (!data || data.length === 0) {
    // If no data provided, generate sample data from page content
    const sampleData = extractTableData()
    if (sampleData.length === 0) {
      toast.info('No tabular data available to export')
      return
    }
    
    const csvContent = '\uFEFF' + generateCSV(sampleData)
    downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;')
    toast.success(`Downloaded ${filename}.csv (Excel compatible)`)
    return
  }
  
  // Generate CSV with Excel-compatible encoding
  const csvContent = '\uFEFF' + generateCSV(data, headers)
  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;')
  toast.success(`Downloaded ${filename}.csv (Excel compatible)`)
}

// Helper: Extract table data from page
function extractTableData(): Record<string, unknown>[] {
  const tables = document.querySelectorAll('table')
  const data: Record<string, unknown>[] = []
  
  tables.forEach((table) => {
    const headers: string[] = []
    const headerCells = table.querySelectorAll('thead th, thead td')
    headerCells.forEach((cell) => {
      headers.push(cell.textContent?.trim() || `Column ${headers.length + 1}`)
    })
    
    if (headers.length === 0) return
    
    const rows = table.querySelectorAll('tbody tr')
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td')
      const rowData: Record<string, unknown> = {}
      cells.forEach((cell, i) => {
        const key = headers[i] || `Column ${i + 1}`
        rowData[key] = cell.textContent?.trim() || ''
      })
      if (Object.keys(rowData).length > 0) {
        data.push(rowData)
      }
    })
  })
  
  return data
}
