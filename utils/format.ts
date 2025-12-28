export function formatCurrency(cents?: number | null, currency = 'usd') {
    if (typeof cents !== 'number') return '—'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(cents / 100)
  }