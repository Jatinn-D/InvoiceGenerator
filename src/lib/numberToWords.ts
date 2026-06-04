import { ToWords } from 'to-words'

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
})

export function amountInWords(amount: number): string {
  try {
    return toWords.convert(amount)
  } catch {
    return ''
  }
}
