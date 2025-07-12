export const formatPhoneNumber = (value: string): string => {
  let cleaned = value.replace(/[^\d+]/g, '')
  
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }
  
  cleaned = '+' + cleaned.slice(1).replace(/\+/g, '')
  cleaned = cleaned.slice(0, 16)
  
  if (cleaned.length <= 1) {
    return cleaned
  }
  
  const digits = cleaned.slice(1)
  
  let countryCodeLength = 1
  if (digits.startsWith('1')) {
    countryCodeLength = 1
  } else if (digits.startsWith('7') || digits.startsWith('86') || digits.startsWith('91')) {
    countryCodeLength = digits.startsWith('7') ? 1 : 2
  } else if (digits.length >= 2) {
    countryCodeLength = 2
    if (digits.startsWith('44') || digits.startsWith('49') || digits.startsWith('33') || 
        digits.startsWith('39') || digits.startsWith('34') || digits.startsWith('81') ||
        digits.startsWith('82') || digits.startsWith('65') || digits.startsWith('66')) {
      countryCodeLength = 2
    } else if (digits.startsWith('852') || digits.startsWith('853') || digits.startsWith('886')) {
      countryCodeLength = 3
    }
  }
  
  if (digits.length < countryCodeLength) {
    return `(+${digits}`
  }
  
  const countryCode = digits.slice(0, countryCodeLength)
  const remaining = digits.slice(countryCodeLength)
  
  if (remaining.length === 0) {
    return `(+${countryCode})`
  }
  
  let formatted = `(+${countryCode}) `
  
  const groups = []
  let remainingDigits = remaining
  
  while (remainingDigits.length > 0) {
    if (remainingDigits.length <= 4) {
      groups.push(remainingDigits)
      break
    } else {
      groups.push(remainingDigits.slice(0, 3))
      remainingDigits = remainingDigits.slice(3)
    }
  }
  
  formatted += groups.join(' ')
  
  return formatted
} 