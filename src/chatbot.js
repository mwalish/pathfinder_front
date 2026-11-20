// Rule-based helper for the chat widget. Returns { text, to?, label? }.
const RULES = [
  { re: /\b(hi|hello|hey)\b/, text: 'Hi! I can help you find trips, hotels, cars and activities, or explain how payment works.' },
  { re: /\b(pay|payment|mpesa|m-pesa)\b/, text: "After you book, tap 'Pay with M-Pesa'. You'll get a prompt on your phone to enter your PIN." },
  { re: /\b(hotels?|stay|room)\b/, text: 'Pick a hotel, choose your dates and room type.', to: '/hotelbooking', label: 'See hotels' },
  { re: /\b(cars?|rent|vehicle|suv)\b/, text: 'Choose a vehicle, set pick-up and return dates, and we work out the total.', to: '/bookcar', label: 'See cars' },
  { re: /\b(activity|activities|tour)\b/, text: 'Browse things to do and book your spot.', to: '/touractivity', label: 'See activities' },
  { re: /\b(trips?|safari|destination|book)\b/, text: 'Browse trips, pick one, then choose your date and group size.', to: '/booktrip', label: 'See trips' },
  { re: /\b(style|preference)\b/, text: 'Tell us how you like to travel and we will remember it.', to: '/travelstyle', label: 'Choose a style' },
  { re: /\b(plan|itinerary|days?)\b/, text: 'Create a plan with the days you want to travel.', to: '/travelplan', label: 'Plan a trip' },
  { re: /\b(sign ?in|log ?in|sign ?up|register|account)\b/, text: 'You need an account to book.', to: '/signin', label: 'Sign in' },
  { re: /\bjoke\b/, text: "Why don't skeletons fight each other? They don't have the guts!" },
];

export const answer = (message) => {
  const msg = message.toLowerCase();
  const rule = RULES.find((r) => r.re.test(msg));
  return rule || { text: 'I can help with trips, hotels, cars, activities, travel plans and M-Pesa payments. What do you need?' };
};
