import { Trip, TravelPackage } from '../types';

const TRIPS_STORAGE_KEY = 'tbo_travelagent_trips';
const PACKAGES_STORAGE_KEY = 'tbo_travelagent_packages';

// Trip Storage Functions
export const saveTrip = (trip: Trip): void => {
  const trips = getTrips();
  const existingIndex = trips.findIndex(t => t.id === trip.id);
  
  if (existingIndex >= 0) {
    trips[existingIndex] = trip;
  } else {
    trips.push(trip);
  }
  
  localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
};

export const getTrips = (): Trip[] => {
  const stored = localStorage.getItem(TRIPS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getTripById = (id: string): Trip | null => {
  const trips = getTrips();
  return trips.find(t => t.id === id) || null;
};

export const deleteTrip = (id: string): void => {
  const trips = getTrips().filter(t => t.id !== id);
  localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
};

export const updateTripStatus = (id: string, status: 'confirmed' | 'pending' | 'in-progress'): void => {
  const trips = getTrips();
  const trip = trips.find(t => t.id === id);
  if (trip) {
    trip.status = status;
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
  }
};

// Package Storage Functions
export const savePackage = (pkg: TravelPackage): void => {
  const packages = getPackages();
  const existingIndex = packages.findIndex(p => p.id === pkg.id);
  
  if (existingIndex >= 0) {
    packages[existingIndex] = pkg;
  } else {
    packages.push(pkg);
  }
  
  localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
};

export const getPackages = (): TravelPackage[] => {
  const stored = localStorage.getItem(PACKAGES_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getPackageById = (id: string): TravelPackage | null => {
  const packages = getPackages();
  return packages.find(p => p.id === id) || null;
};

// Initialize with mock data if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(TRIPS_STORAGE_KEY)) {
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(PACKAGES_STORAGE_KEY)) {
    localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify([]));
  }
};

// Generate unique ID
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
