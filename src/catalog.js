// One entry per catalogue section. `category` is the backend filter, `unit` explains what the price means.
export const KINDS = {
  trip: {
    title: 'Explore Trips', route: '/booktrip', detail: '/trip-details', unit: 'per person',
    search: 'Where do you want to go?', loading: 'Loading amazing destinations...', empty: 'No trips found.',
    bg: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80',
  },
  activity: {
    title: 'Activities', route: '/touractivity', detail: '/activity-details', unit: 'per person',
    search: 'Search activity name...', loading: 'Finding exciting activities...', empty: 'No activities found.',
    bg: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=1920&q=80',
  },
  car: {
    title: 'Rent a Car', route: '/bookcar', detail: '/car-details', unit: 'per day',
    search: 'Search car model (e.g. SUV, Land Cruiser)...', loading: 'Locating available vehicles...', empty: 'No vehicles found.',
    bg: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80',
  },
  hotel: {
    title: 'Book a Hotel', route: '/hotelbooking', detail: '/hotel-details', unit: 'per night',
    search: 'Search by hotel name...', loading: 'Fetching hotels...', empty: 'No hotels found.',
    bg: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80',
  },
  style: {
    title: 'Travel Styles', route: '/travelstyle', detail: '/style-details', unit: '',
    search: 'Search travel styles...', loading: 'Curating travel styles...', empty: 'No travel styles found.',
    bg: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80',
  },
};
