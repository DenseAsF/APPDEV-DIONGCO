import SHA256 from 'crypto-js/sha256';

export const hashPassword = (password: string): string => {
  return SHA256(password).toString();
};
