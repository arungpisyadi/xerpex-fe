export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const startFormatted = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

  const endFormatted = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return `${startFormatted} - ${endFormatted}`
}

export function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(numAmount)
}

export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end
}

export function getNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    checked_in: '#10B981',
    checked_out: '#8B5CF6',
    completed: '#6B7280',
    cancelled: '#EF4444'
  }
  return colorMap[status] || colorMap.pending
}
