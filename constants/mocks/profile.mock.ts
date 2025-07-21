import {UserProfile} from '@/definitions/types';

export const profileMock: UserProfile = {
    id: 'user-123',
    first_name: 'John',
    last_name: 'Doe',
    age: 28,
    city: 'Paris',
    instruments: ['Guitar', 'Vocals'],
    jams_participated: [], // This would be populated with actual jam sessions
    email: 'john.doe@example.com',
};

export const profileListMock: UserProfile[] = [
    {
        id: 'user-123',
        first_name: 'John',
        last_name: 'Doe',
        age: 28,
        city: 'Paris',
        instruments: ['Guitar', 'Vocals'],
        jams_participated: [],
        email: 'john.doe@example.com',
    },
    {
        id: 'user-456',
        first_name: 'Marie',
        last_name: 'Dupont',
        age: 32,
        city: 'Lyon',
        instruments: ['Piano', 'Keyboard'],
        jams_participated: [],
        email: 'marie.dupont@example.com',
    },
    {
        id: 'user-789',
        first_name: 'Pierre',
        last_name: 'Martin',
        age: 25,
        city: 'Marseille',
        instruments: ['Drums'],
        jams_participated: [],
        email: 'pierre.martin@example.com',
    },
    {
        id: 'user-101',
        first_name: 'Sophie',
        last_name: 'Bernard',
        age: 30,
        city: 'Paris',
        instruments: ['Bass', 'Vocals'],
        jams_participated: [],
        email: 'sophie.bernard@example.com',
    },
    {
        id: 'user-202',
        first_name: 'Lucas',
        last_name: 'Petit',
        age: 26,
        city: 'Lyon',
        instruments: ['Saxophone'],
        jams_participated: [],
        email: 'lucas.petit@example.com',
    },
];