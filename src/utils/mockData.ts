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
  {
    id: '7',
    name: 'Behavioral Sciences Building',
    abbreviation: 'BEH',
    aliases: ['beh', 'behavioral', 'behavioral sciences', 'psychology'],
    coordinates: {
      latitude: 28.0589,
      longitude: -82.4152,
    },
  },
  {
    id: '8',
    name: 'Education Building',
    abbreviation: 'EDU',
    aliases: ['edu', 'education', 'college of education'],
    coordinates: {
      latitude: 28.0578,
      longitude: -82.4168,
    },
  },
  {
    id: '9',
    name: 'Cooper Hall',
    abbreviation: 'CPR',
    aliases: ['cpr', 'cooper', 'cooper hall'],
    coordinates: {
      latitude: 28.0592,
      longitude: -82.4175,
    },
  },
  {
    id: '10',
    name: 'Natural & Environmental Sciences',
    abbreviation: 'NES',
    aliases: ['nes', 'environmental', 'natural sciences'],
    coordinates: {
      latitude: 28.0604,
      longitude: -82.4128,
    },
  },
  {
    id: '11',
    name: 'Psychology Building',
    abbreviation: 'PCD',
    aliases: ['pcd', 'psychology', 'psych'],
    coordinates: {
      latitude: 28.0585,
      longitude: -82.4155,
    },
  },
  {
    id: '12',
    name: 'Student Services Building',
    abbreviation: 'SVC',
    aliases: ['svc', 'student services', 'services'],
    coordinates: {
      latitude: 28.0595,
      longitude: -82.4192,
    },
  },
  {
    id: '13',
    name: 'Chemistry Building',
    abbreviation: 'CHE',
    aliases: ['che', 'chemistry', 'chem'],
    coordinates: {
      latitude: 28.0598,
      longitude: -82.4135,
    },
  },
  {
    id: '14',
    name: 'Physics Building',
    abbreviation: 'PHY',
    aliases: ['phy', 'physics'],
    coordinates: {
      latitude: 28.0602,
      longitude: -82.4142,
    },
  },
  {
    id: '15',
    name: 'Fine Arts Building',
    abbreviation: 'FAH',
    aliases: ['fah', 'fine arts', 'arts'],
    coordinates: {
      latitude: 28.0612,
      longitude: -82.4158,
    },
  },
  {
    id: '16',
    name: 'Theatre Building',
    abbreviation: 'TAR',
    aliases: ['tar', 'theatre', 'theater'],
    coordinates: {
      latitude: 28.0615,
      longitude: -82.4165,
    },
  },
  {
    id: '17',
    name: 'Music Building',
    abbreviation: 'MUS',
    aliases: ['mus', 'music'],
    coordinates: {
      latitude: 28.0618,
      longitude: -82.4172,
    },
  },
  {
    id: '18',
    name: 'Communication Building',
    abbreviation: 'CMC',
    aliases: ['cmc', 'communication', 'comm'],
    coordinates: {
      latitude: 28.0608,
      longitude: -82.4182,
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
