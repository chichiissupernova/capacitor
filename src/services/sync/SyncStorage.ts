
/**
 * Storage utilities for the sync system
 * Enhanced with basic encryption for better security
 */

import { PendingOperation } from './SyncTypes';

export class SyncStorage {
  private static readonly STORAGE_KEY = 'chichi_pending_sync';
  private static readonly ENCRYPTION_KEY = 'chichi_app'; // In production, this should be a more secure key

  /**
   * Basic encryption for securing stored data
   */
  private static encrypt(data: string): string {
    try {
      // Simple XOR encryption - for production, use a proper encryption library
      return Array.from(data)
        .map(char => 
          String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(0))
        )
        .join('');
    } catch (error) {
      console.error('Error encrypting data:', error);
      return data; // Fallback to unencrypted
    }
  }

  /**
   * Basic decryption for retrieving stored data
   */
  private static decrypt(encryptedData: string): string {
    try {
      // Simple XOR decryption - for production, use a proper encryption library
      return Array.from(encryptedData)
        .map(char => 
          String.fromCharCode(char.charCodeAt(0) ^ this.ENCRYPTION_KEY.charCodeAt(0))
        )
        .join('');
    } catch (error) {
      console.error('Error decrypting data:', error);
      return encryptedData; // Fallback to treating as unencrypted
    }
  }

  /**
   * Load pending operations from localStorage with basic decryption
   */
  static loadPendingOperations(): PendingOperation[] {
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEY);
      if (encrypted) {
        const decrypted = this.decrypt(encrypted);
        const parsed = JSON.parse(decrypted);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error("Error loading pending operations:", e);
    }
    return [];
  }
  
  /**
   * Save pending operations to localStorage with basic encryption
   */
  static savePendingOperations(operations: PendingOperation[]): void {
    try {
      if (!Array.isArray(operations)) {
        console.error("Invalid operations format (not an array):", operations);
        return;
      }
      
      const data = JSON.stringify(operations);
      const encrypted = this.encrypt(data);
      localStorage.setItem(this.STORAGE_KEY, encrypted);
    } catch (e) {
      console.error("Error saving pending operations:", e);
    }
  }
  
  /**
   * Create a key for storing user-specific data
   */
  static getUserStorageKey(userId: string, key: string): string {
    return `chichi_${key}_${userId}`;
  }
  
  /**
   * Save user-specific data
   */
  static saveUserData(userId: string, key: string, data: any): void {
    try {
      const storageKey = this.getUserStorageKey(userId, key);
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving user data for ${key}:`, e);
    }
  }
  
  /**
   * Load user-specific data
   */
  static loadUserData<T>(userId: string, key: string, defaultValue: T): T {
    try {
      const storageKey = this.getUserStorageKey(userId, key);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error loading user data for ${key}:`, e);
      return defaultValue;
    }
  }
  
  /**
   * Clear all user data
   */
  static clearUserData(userId: string): void {
    try {
      const keyPrefix = `chichi_`;
      const userPrefix = `_${userId}`;
      
      // Find all keys belonging to this user
      Object.keys(localStorage)
        .filter(key => key.startsWith(keyPrefix) && key.includes(userPrefix))
        .forEach(key => {
          localStorage.removeItem(key);
        });
    } catch (e) {
      console.error("Error clearing user data:", e);
    }
  }
}
