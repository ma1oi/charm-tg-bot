import { User } from '@prisma/client';
import { Product } from '@/types/product';

export class ValidationError extends Error {
  constructor(message: string) {
    super(`Validation error: ${message}`);
    this.name = 'ValidationError';
  }
}

export const isValidNumber = (value: string): boolean => {
  const num = Number(value);
  return !isNaN(num) && Number.isFinite(num);
};

export const isValidPrice = (value: string): boolean => {
  const num = Number(value);
  return isValidNumber(value) && num > 0;
};

export const isValidString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isValidLength = (value: string, min: number, max: number): boolean => {
  return value.length >= min && value.length <= max;
};

export const isValidEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const isValidProduct = (product: Partial<Product>): boolean => {
  if (!product || typeof product !== 'object') {
    throw new ValidationError('Invalid product object');
  }

  if (!isValidString(product.name)) {
    throw new ValidationError('Product name is required and must be non-empty');
  }

  if (typeof product.cost !== 'number' || product.cost <= 0) {
    throw new ValidationError('Product cost must be a positive number');
  }

  if (!isValidString(product.image)) {
    throw new ValidationError('Product image URL is required and must be non-empty');
  }

  return true;
};

interface ExtendedUser extends User {
  isPremium: boolean;
  languageCode: string | null;
}

export const isValidUser = (user: Partial<ExtendedUser>): boolean => {
  if (!user || typeof user !== 'object') {
    throw new ValidationError('Invalid user object');
  }

  if (typeof user.tuid !== 'bigint') {
    throw new ValidationError('User TUID must be a BigInt');
  }

  if (user.username !== null && typeof user.username !== 'string') {
    throw new ValidationError('Username must be a string or null');
  }

  if (user.name !== null && typeof user.name !== 'string') {
    throw new ValidationError('Name must be a string or null');
  }

  if (user.isPremium !== undefined && typeof user.isPremium !== 'boolean') {
    throw new ValidationError('isPremium must be a boolean');
  }

  if (user.languageCode !== undefined && user.languageCode !== null && typeof user.languageCode !== 'string') {
    throw new ValidationError('Language code must be a string or null');
  }

  return true;
};

export const validateDatabaseResponse = <T>(
  data: T | null | undefined,
  errorMessage: string = 'Database error: Invalid response'
): T => {
  if (!data) {
    throw new Error(errorMessage);
  }
  return data;
};

export const isValidOrderDescription = (description: string): boolean => {
  if (!isValidString(description)) {
    throw new ValidationError('Order description is required');
  }

  if (!isValidLength(description, 10, 1000)) {
    throw new ValidationError('Order description must be between 10 and 1000 characters');
  }

  return true;
};

export const isValidPromocode = (code: string): boolean => {
  if (!isValidString(code)) {
    throw new ValidationError('Promocode is required');
  }

  if (!isValidLength(code, 3, 20)) {
    throw new ValidationError('Promocode must be between 3 and 20 characters');
  }

  if (!/^[A-Za-z0-9_-]+$/.test(code)) {
    throw new ValidationError('Promocode can only contain letters, numbers, underscores and hyphens');
  }

  return true;
}; 