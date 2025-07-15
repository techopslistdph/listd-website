export const formatPhoneNumber = (value: string): string => {

  let cleaned = value.replace(/[^\d]/g, '');

  if (cleaned.startsWith('63')) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }


  cleaned = cleaned.slice(0, 10);

  if (!cleaned) {
    return '(+63) ';
  }


  let formatted = '(+63) ';
  if (cleaned.length <= 3) {
    formatted += cleaned;
  } else if (cleaned.length <= 6) {
    formatted += `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  } else {
    formatted += `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  return formatted;
};


export const formatPhoneNumberRaw = (value: string): string => {
  let cleaned = value.replace(/[^\d]/g, '');

  if (cleaned.startsWith('63')) {
    cleaned = cleaned.slice(2);
  }
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  cleaned = cleaned.slice(0, 10);

  if (!cleaned) {
    return '';
  }

  return `+63${cleaned}`;
};