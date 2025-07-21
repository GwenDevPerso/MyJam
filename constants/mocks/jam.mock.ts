import {JamSession, Participant} from '@/definitions/types';

// Mock participants data
const mockParticipants: Participant[] = [
  {
    firstName: 'John',
    lastName: 'Doe',
    age: 28,
    city: 'Paris',
    instruments: ['Guitar', 'Vocals'],
    jamsParticipated: [], // Circular reference avoided in mocks
    jamsCreated: [],
  },
  {
    firstName: 'Marie',
    lastName: 'Dupont',
    age: 32,
    city: 'Lyon',
    instruments: ['Piano', 'Keyboard'],
    jamsParticipated: [],
    jamsCreated: [],
  },
  {
    firstName: 'Pierre',
    lastName: 'Martin',
    age: 25,
    city: 'Marseille',
    instruments: ['Drums'],
    jamsParticipated: [],
    jamsCreated: [],
  },
  {
    firstName: 'Sophie',
    lastName: 'Bernard',
    age: 30,
    city: 'Paris',
    instruments: ['Bass', 'Vocals'],
    jamsParticipated: [],
    jamsCreated: [],
  },
  {
    firstName: 'Lucas',
    lastName: 'Petit',
    age: 26,
    city: 'Lyon',
    instruments: ['Saxophone'],
    jamsParticipated: [],
    jamsCreated: [],
  },
];

export const jamListMock: JamSession[] = [
    {
      id: 1,
      name: 'Jam Session 1',
      description: 'Description of Jam Session 1',
      style: 'Jazz',
      date: new Date('2025-01-01'),
      city: 'Paris',
      location: 'Le Sunset',
      participants: [mockParticipants[0], mockParticipants[1], mockParticipants[3]],
      createdBy: 'user-123',
    },
    {
      id: 2,
      name: 'Jam Session 2',
      description: 'Description of Jam Session 2',
      style: 'Rock',
      date: new Date('2025-01-02'),
      city: 'Lyon',
      location: 'Studio B',
      participants: [mockParticipants[1], mockParticipants[4]],
      createdBy: 'user-456',
    },
    {
      id: 3,
      name: 'Jam Session 3',
      description: 'Description of Jam Session 3',
      style: 'Blues',
      date: new Date('2025-01-03'),
      city: 'Marseille',
      location: 'Café de la Musique',
      participants: [mockParticipants[2], mockParticipants[3]],
      createdBy: 'user-789',
    },
    {
      id: 4,
      name: 'Jam Session 4',
      description: 'Description of Jam Session 4',
      style: 'Blues',
      date: new Date('2025-01-04'),
      city: 'Marseille',
      location: 'Café de la Musique',
      participants: [mockParticipants[0], mockParticipants[2], mockParticipants[4]],
      createdBy: 'user-123',
    },
    {
      id: 5,
      name: 'Jam Session 5',
      description: 'Description of Jam Session 5',
      style: 'Blues',
      date: new Date('2025-01-05'),
      city: 'Marseille',
      location: 'Café de la Musique',
      participants: [mockParticipants[1], mockParticipants[3], mockParticipants[4]],
      createdBy: 'user-456',
    },
  ];

// Export individual participant mocks for reuse
export {mockParticipants};
