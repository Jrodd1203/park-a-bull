// Database types matching Supabase schema

export interface Database {
  public: {
    Tables: {
      buildings: {
        Row: {
          id: string;
          name: string;
          abbreviation: string;
          aliases: string[];
          latitude: number;
          longitude: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          abbreviation: string;
          aliases?: string[];
          latitude: number;
          longitude: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          abbreviation?: string;
          aliases?: string[];
          latitude?: number;
          longitude?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      parking_lots: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          type: 'garage' | 'lot';
          permits: string[];
          capacity: number;
          current_occupancy: number;
          floors: number | null;
          latitude: number;
          longitude: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name: string;
          type: 'garage' | 'lot';
          permits: string[];
          capacity: number;
          current_occupancy?: number;
          floors?: number | null;
          latitude: number;
          longitude: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          short_name?: string;
          type?: 'garage' | 'lot';
          permits?: string[];
          capacity?: number;
          current_occupancy?: number;
          floors?: number | null;
          latitude?: number;
          longitude?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          permit_type: string;
          current_lot_id: string | null;
          checkin_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          permit_type?: string;
          current_lot_id?: string | null;
          checkin_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          permit_type?: string;
          current_lot_id?: string | null;
          checkin_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      checkins: {
        Row: {
          id: string;
          user_id: string;
          lot_id: string;
          permit_type: string;
          floor: number | null;
          spot_number: string | null;
          status: 'active' | 'departed';
          checked_in_at: string;
          checked_out_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lot_id: string;
          permit_type: string;
          floor?: number | null;
          spot_number?: string | null;
          status?: 'active' | 'departed';
          checked_in_at?: string;
          checked_out_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lot_id?: string;
          permit_type?: string;
          floor?: number | null;
          spot_number?: string | null;
          status?: 'active' | 'departed';
          checked_in_at?: string;
          checked_out_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Convenience types
export type Building = Database['public']['Tables']['buildings']['Row'];
export type ParkingLot = Database['public']['Tables']['parking_lots']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Checkin = Database['public']['Tables']['checkins']['Row'];

export type BuildingInsert = Database['public']['Tables']['buildings']['Insert'];
export type ParkingLotInsert = Database['public']['Tables']['parking_lots']['Insert'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type CheckinInsert = Database['public']['Tables']['checkins']['Insert'];
