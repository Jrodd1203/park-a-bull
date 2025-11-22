import { supabase } from '../../supabase';
import { Building } from '../types/database';

/**
 * Get all buildings
 */
export async function getAllBuildings(): Promise<Building[]> {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching buildings:', error);
    throw error;
  }

  return data;
}

/**
 * Search buildings by name, abbreviation, or aliases
 */
export async function searchBuildings(query: string): Promise<Building[]> {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) {
    return getAllBuildings();
  }

  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,abbreviation.ilike.%${searchTerm}%`)
    .order('name');

  if (error) {
    console.error('Error searching buildings:', error);
    throw error;
  }

  // Also filter by aliases (RLS doesn't support GIN index queries well)
  const filteredData = data.filter(building =>
    building.aliases.some(alias =>
      alias.toLowerCase().includes(searchTerm)
    )
  );

  return filteredData.length > 0 ? filteredData : data;
}

/**
 * Get a single building by ID
 */
export async function getBuildingById(id: string): Promise<Building | null> {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching building:', error);
    throw error;
  }

  return data;
}

/**
 * Get building by name (exact match)
 */
export async function getBuildingByName(name: string): Promise<Building | null> {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .ilike('name', name)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    console.error('Error fetching building by name:', error);
    throw error;
  }

  return data;
}
