
/**
 * Core sync engine providing synchronization between local and remote data
 */

import { SyncStatus, PendingOperation } from './SyncTypes';
import { SyncOperationsProcessor } from './SyncOperationsProcessor'; 
import { SyncTableHandler } from './SyncTableHandler';
import { SyncStorage } from './SyncStorage';
import { v4 as uuidv4 } from 'uuid';

type StatusListener = (status: SyncStatus) => void;

export class SyncEngine {
  private static instance: SyncEngine;
  private status: SyncStatus = 'online';
  private syncInterval: number | null = null;
  private statusListeners: StatusListener[] = [];
  private pendingOperations: PendingOperation[] = [];
  private operationsProcessor: SyncOperationsProcessor;
  private tableHandler: SyncTableHandler;
  
  private constructor() {
    this.operationsProcessor = new SyncOperationsProcessor();
    this.tableHandler = new SyncTableHandler();
    this.loadPendingOperations();
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): SyncEngine {
    if (!SyncEngine.instance) {
      SyncEngine.instance = new SyncEngine();
    }
    return SyncEngine.instance;
  }
  
  /**
   * Get current offline status
   */
  public static isOffline(): boolean {
    return SyncEngine.getInstance().getStatus() === 'offline';
  }
  
  /**
   * Get current sync status
   */
  public getStatus(): SyncStatus {
    return this.status;
  }
  
  /**
   * Get pending operations count
   */
  public getPendingCount(): number {
    return this.pendingOperations.length;
  }
  
  /**
   * Add a status change listener
   */
  public addStatusListener(listener: StatusListener): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }
  
  /**
   * Update sync status and notify listeners
   */
  private setStatus(newStatus: SyncStatus): void {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.notifyListeners();
    }
  }
  
  /**
   * Notify all status listeners of changes
   */
  private notifyListeners(): void {
    this.statusListeners.forEach(listener => {
      try {
        listener(this.status);
      } catch (e) {
        console.error('Error in sync status listener:', e);
      }
    });
  }
  
  /**
   * Start periodic sync process
   */
  public startSync(intervalMs: number = 30000): void {
    if (this.syncInterval !== null) {
      this.stopSync();
    }
    
    // Do an immediate sync
    this.performSync();
    
    // Set up interval for periodic syncing
    this.syncInterval = window.setInterval(() => {
      this.performSync();
    }, intervalMs);
  }
  
  /**
   * Stop the sync process
   */
  public stopSync(): void {
    if (this.syncInterval !== null) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
  
  /**
   * Check if we're online by testing connection
   */
  private async checkOnlineStatus(): Promise<boolean> {
    if (!navigator.onLine) {
      return false;
    }
    
    try {
      // Attempt a lightweight API call to check real connectivity
      const response = await fetch('/api/ping', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Very short timeout to fail fast
        signal: AbortSignal.timeout(3000)
      });
      
      return response.ok;
    } catch (e) {
      console.log('Connectivity check failed:', e);
      return false;
    }
  }
  
  /**
   * Load pending operations from storage
   */
  private async loadPendingOperations(): Promise<void> {
    try {
      this.pendingOperations = await SyncStorage.loadPendingOperations();
      this.updateStatusBasedOnPending();
    } catch (e) {
      console.error('Error loading pending operations:', e);
      this.pendingOperations = [];
    }
  }
  
  /**
   * Update status based on pending operations
   */
  private updateStatusBasedOnPending(): void {
    if (this.pendingOperations.length > 0) {
      this.setStatus(this.status === 'offline' ? 'offline' : 'online');
    }
  }
  
  /**
   * Add operation to sync queue
   */
  public queueOperation(
    table: string,
    operation: 'insert' | 'update' | 'delete',
    data: any
  ): string {
    const id = uuidv4();
    const newOperation: PendingOperation = {
      id,
      table,
      operation,
      data,
      timestamp: Date.now()
    };
    
    this.pendingOperations.push(newOperation);
    SyncStorage.savePendingOperations(this.pendingOperations);
    this.updateStatusBasedOnPending();
    
    // Try immediate sync if we appear to be online
    if (this.status !== 'offline') {
      this.performSync();
    }
    
    return id;
  }
  
  /**
   * Perform sync of pending operations
   */
  private async performSync(): Promise<void> {
    if (this.pendingOperations.length === 0) {
      return; // Nothing to sync
    }
    
    // Check if we're online
    const isOnline = await this.checkOnlineStatus();
    if (!isOnline) {
      this.setStatus('offline');
      return;
    }
    
    // We're online, try to sync
    this.setStatus('syncing');
    
    try {
      const operationsToProcess = [...this.pendingOperations];
      
      const { succeeded, failed } = await this.operationsProcessor.processOperations(
        operationsToProcess,
        this.tableHandler
      );
      
      // Remove successful operations
      if (succeeded.length > 0) {
        this.pendingOperations = this.pendingOperations.filter(
          op => !succeeded.includes(op.id)
        );
        
        // Save updated pending operations
        await SyncStorage.savePendingOperations(this.pendingOperations);
      }
      
      // Update status based on results
      if (failed.length > 0) {
        console.warn(`${failed.length} operations failed to sync`);
      }
      
      this.setStatus(this.pendingOperations.length > 0 ? 'online' : 'online');
    } catch (e) {
      console.error('Error during sync:', e);
      this.setStatus('offline');
    }
  }
}
