export interface Booking {
	id: string;
	title: string;
	date: Date;
	time: string;
	location?: string;
	type: 'wedding' | 'birthday' | 'corporate' | 'other';
	status: 'confirmed' | 'pending' | 'blocked' | 'inquiry';
	clientName: string;
	totalCost: number;
	paidAmount: number;
}

export const bookings: Booking[] = [
	{
		id: '1',
		title: 'Wedding - Adebayo',
		date: new Date(2023, 9, 5), // Oct 5
		time: '2:00 PM - 10:00 PM',
		location: 'Hall A',
		type: 'wedding',
		status: 'confirmed',
		clientName: 'Kunle Adebayo',
		totalCost: 1500000,
		paidAmount: 1000000,
	},
	{
		id: '2',
		title: 'Pending Request',
		date: new Date(2023, 9, 5), // Oct 5
		time: '10:00 AM',
		type: 'other',
		status: 'pending',
		clientName: 'Unknown',
		totalCost: 0,
		paidAmount: 0,
	},
	{
		id: '3',
		title: 'Blocked for Maintenance',
		date: new Date(2023, 9, 10),
		time: 'All Day',
		type: 'other',
		status: 'blocked',
		clientName: 'Internal',
		totalCost: 0,
		paidAmount: 0,
	},
	{
		id: '4',
		title: 'Birthday Party',
		date: new Date(2023, 9, 12),
		time: '6:00 PM',
		location: 'Garden',
		type: 'birthday',
		status: 'confirmed',
		clientName: 'Sarah J',
		totalCost: 500000,
		paidAmount: 500000,
	},
	{
		id: '5',
		title: 'Inquiry: Tech Expo',
		date: new Date(2023, 9, 15),
		time: '9:00 AM',
		type: 'corporate',
		status: 'pending', // inquiry/pending yellow
		clientName: 'TechCorp',
		totalCost: 3000000,
		paidAmount: 0,
	},
	{
		id: '6',
		title: 'Reception',
		date: new Date(2023, 9, 18),
		time: '1:00 PM',
		type: 'wedding',
		status: 'confirmed', // inquiry/pending yellow
		clientName: 'John Doe',
		totalCost: 800000,
		paidAmount: 800000,
	},
	{
		id: '7',
		title: 'Tech Expo Main',
		date: new Date(2023, 9, 26),
		time: '9:00 AM',
		location: 'Main Hall',
		type: 'corporate',
		status: 'confirmed',
		clientName: 'TechCorp',
		totalCost: 3000000,
		paidAmount: 1500000,
	},
	{
		id: '8',
		title: 'Payment Reminder',
		date: new Date(2023, 9, 30),
		time: 'Urgent',
		type: 'other',
		status: 'pending', // using pending for red/urgent look if needed
		clientName: 'Chief Obi',
		totalCost: 0,
		paidAmount: 0,
	},
];
