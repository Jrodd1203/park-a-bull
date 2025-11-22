export interface Lot {
  id: string;
  name: string;
  permits: string[];
  capacity: number;
  current_occupancy: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Checkin {
  id: string;
  user_id: string;
  lot_id: string;
  permit_type: string;
  status: 'active' | 'departed';
  timestamp: string;
}

export interface Profile {
  id: string;
  permit_type: string;
  current_lot_id: string | null;
  checkin_count: number;
}

export interface Building {
  id: string;
  name: string;
  abbreviation: string;
  aliases: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
