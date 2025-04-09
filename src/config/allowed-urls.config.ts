export const ALLOWED_URLS = {
  MERCADO_BITCOIN: {
    BASE_URL: 'https://www.mercadobitcoin.net/api',
    ENDPOINTS: {
      DAY_SUMMARY: '/BTC/day-summary',
      TICKER: '/BTC/ticker'
    }
  }
}

export const isAllowedUrl = (url: string): boolean => {
  const allowedBaseUrl = ALLOWED_URLS.MERCADO_BITCOIN.BASE_URL
  return url.startsWith(allowedBaseUrl)
} 