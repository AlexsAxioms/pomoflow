// Utility functions for localStorage persistence

export interface StorageConfig {
  key: string
  defaultValue: any
  serialize?: (value: any) => string
  deserialize?: (value: string) => any
}

// Generic localStorage hook utility
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  serialize = JSON.stringify,
  deserialize = JSON.parse
): [T, (value: T) => void] {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return [defaultValue, () => {}]
  }

  // Get stored value or use default
  const getStoredValue = (): T => {
    try {
      const item = window.localStorage.getItem(key)
      if (item === null) return defaultValue
      return deserialize(item)
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  // Set stored value
  const setStoredValue = (value: T): void => {
    try {
      window.localStorage.setItem(key, serialize(value))
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [getStoredValue(), setStoredValue]
}

// Specific storage utilities for the app
export const STORAGE_KEYS = {
  TASKS: 'pomoflow-tasks',
  COMPLETED_TASKS: 'pomoflow-completed-tasks',
  NOTES: 'pomoflow-notes',
  DASHBOARD_LAYOUT: 'pomoflow-dashboard-layout',
  USER_PREFERENCES: 'pomoflow-user-preferences',
  SUBSCRIPTION_STATUS: 'pomoflow-subscription-status',
  TIMER_SETTINGS: 'pomoflow-timer-settings'
} as const

// Type-safe storage functions
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = window.localStorage.getItem(key)
    if (item === null) return defaultValue
    return JSON.parse(item)
  } catch (error) {
    console.warn(`Error loading from storage key "${key}":`, error)
    return defaultValue
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Error saving to storage key "${key}":`, error)
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return
  
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(`Error removing from storage key "${key}":`, error)
  }
}

// Backup and restore functions
export function exportData(): string {
  const data: Record<string, any> = {}
  
  Object.values(STORAGE_KEYS).forEach(key => {
    const value = loadFromStorage(key, null)
    if (value !== null) {
      data[key] = value
    }
  })
  
  return JSON.stringify(data, null, 2)
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData)
    
    Object.entries(data).forEach(([key, value]) => {
      if (Object.values(STORAGE_KEYS).includes(key as any)) {
        saveToStorage(key, value)
      }
    })
    
    return true
  } catch (error) {
    console.error('Error importing data:', error)
    return false
  }
}

// Clear all app data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key)
  })
}