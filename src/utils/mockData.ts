import { Building, Lot } from '../types';

export const mockBuildings: Building[] = [
  {
    id: '1',
    name: 'Library',
    abbreviation: 'LIB',
    aliases: ['library', 'lib', 'tampa library'],
    coordinates: {
      latitude: 28.0586,
      longitude: -82.4138,
    },
  },
  {
    id: '2',
    name: 'Marshall Student Center',
    abbreviation: 'MSC',
    aliases: ['msc', 'marshall', 'student center'],
    coordinates: {
      latitude: 28.0651,
      longitude: -82.4189,
    },
  },
  {
    id: '3',
    name: 'Recreation Center',
    abbreviation: 'REC',
    aliases: ['rec', 'rec center', 'gym', 'recreation'],
    coordinates: {
      latitude: 28.0643,
      longitude: -82.4203,
    },
  },
  {
    id: '4',
    name: 'Business Building',
    abbreviation: 'BSN',
    aliases: ['bsn', 'business', 'muma'],
    coordinates: {
      latitude: 28.0593,
      longitude: -82.4187,
    },
  },
  {
    id: '5',
    name: 'Engineering Building',
    abbreviation: 'ENG',
    aliases: ['eng', 'engineering', 'enc'],
    coordinates: {
      latitude: 28.0601,
      longitude: -82.4145,
    },
  },
  {
    id: '6',
    name: 'Science Center',
    abbreviation: 'ISA',
    aliases: ['isa', 'science', 'science center'],
    coordinates: {
      latitude: 28.0596,
      longitude: -82.4131,
    },
  },
];

export const mockLots: Lot[] = [
  {
    id: '1',
    name: 'Lot 1A',
    permits: ['S - Student', 'Y - Commuter', 'E - Faculty/Staff'],
    capacity: 150,
    current_occupancy: 45,
    coordinates: {
      latitude: 28.0580,
      longitude: -82.4125,
    },
  },
  {
    id: '2',
    name: 'Lot 2B',
    permits: ['S - Student', 'Y - Commuter'],
    capacity: 200,
    current_occupancy: 175,
    coordinates: {
      latitude: 28.0595,
      longitude: -82.4150,
    },
  },
  {
    id: '3',
    name: 'Lot 3C',
    permits: ['E - Faculty/Staff', 'D - Disabled'],
    capacity: 100,
    current_occupancy: 85,
    coordinates: {
      latitude: 28.0610,
      longitude: -82.4170,
    },
  },
  {
    id: '4',
    name: 'Lot 4D',
    permits: ['S - Student', 'Y - Commuter', 'R - Resident'],
    capacity: 300,
    current_occupancy: 120,
    coordinates: {
      latitude: 28.0640,
      longitude: -82.4200,
    },
  },
  {
    id: '5',
    name: 'Lot 5E',
    permits: ['R - Resident'],
    capacity: 250,
    current_occupancy: 230,
    coordinates: {
      latitude: 28.0660,
      longitude: -82.4210,
    },
  },
  {
    id: '6',
    name: 'Lot 6F',
    permits: ['S - Student', 'Y - Commuter', 'E - Faculty/Staff'],
    capacity: 180,
    current_occupancy: 60,
    coordinates: {
      latitude: 28.0575,
      longitude: -82.4135,
    },
  },
  {
    id: '7',
    name: 'Garage A',
    permits: ['S - Student', 'Y - Commuter', 'E - Faculty/Staff', 'Visitor'],
    capacity: 500,
    current_occupancy: 450,
    coordinates: {
      latitude: 28.0655,
      longitude: -82.4195,
    },
  },
  {
    id: '8',
    name: 'Garage B',
    permits: ['S - Student', 'Y - Commuter', 'E - Faculty/Staff', 'R - Resident'],
    capacity: 600,
    current_occupancy: 320,
    coordinates: {
      latitude: 28.0620,
      longitude: -82.4180,
    },
  },
  {
    id: '9',
    name: 'Lot 7G',
    permits: ['Visitor', 'E - Faculty/Staff'],
    capacity: 80,
    current_occupancy: 15,
    coordinates: {
      latitude: 28.0590,
      longitude: -82.4140,
    },
  },
  {
    id: '10',
    name: 'Lot 8H',
    permits: ['S - Student', 'Y - Commuter'],
    capacity: 220,
    current_occupancy: 195,
    coordinates: {
      latitude: 28.0635,
      longitude: -82.4215,
    },
  },
];
