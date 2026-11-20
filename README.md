# Pathfinder frontend (React 19 + Vite)

Your `pathfinder_latests` app, moved from Create React App to Vite and rewired to the new Django + DRF API.

```bash
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:8000
npm run dev               # http://localhost:3000
npm test                  # Vitest: unit tests for the pure logic (src/utils.test.js)
npm run build             # output in dist/
```
The backend must allow this origin: `CORS_ALLOWED_ORIGINS=http://localhost:3000` (any origin is allowed while `DJANGO_DEBUG=1`).

## What changed
| Before | Now |
|---|---|
| URLs hard-coded in every file (`lexluther…`, `mwalish…`) | one `src/api.js` + `VITE_API_URL` |
| Every list page downloaded **all** products and filtered/paged in the browser | server-side `category`, `search`, `ordering`, paging in one request (`Catalog.jsx`) |
| Card clicks went to `/trip-details`, `/car-details`, … which did not exist | `Details.jsx` serves all five detail routes with booking forms and price totals |
| Home forms posted to `/api/style`, `/api/plan`, `/api/product` (wrong) and sent fields the API ignores | each service is a page that posts to `add_style`, `add_plan`, `addproducts` with the right fields |
| Plan page called `/api/gettravelplans` and read `plan_name` | uses `get_plans` (`place`, `period_type`, `days`) with a create form and paging |
| Booking asked users to retype their name/email | uses the signed-in user (key `user` in localStorage, unchanged) |
| No way to pay | M-Pesa prompt after booking (`PayModal.jsx`) |
| Auth.jsx, Signin.jsx, Signup.jsx (+ commented-out copies), Services.jsx, RentCar.jsx, Explorer.jsx | one `Auth.jsx` (keeps strength meter, confirm password, terms, show password); dead files removed |
| 10+ CSS files redefining `.hero-container`/`.glass-card` | one `src/styles.css` |
| Two copy-pasted chatbots with canned small talk | one `ChatPanel.jsx` that links to the right page |

## How catalogue sections work
All items live in one table. As before, the **name** decides the section: contains `trip`, `activity`, `style`, `model`/`car`, or ends with `hotel`. The new **Add product** page has a category picker that adds the keyword for you. Prices (`product_cost`) are treated as per person (trips, activities), per day (cars) and per night (hotels).

## Roles and dashboards
Sign-in stores the user and token (`user`, `token` in localStorage); `src/api.js` attaches the token to every request and signs the user out when the API says it expired.
- **Traveler:** `/dashboard` (own stats, recent bookings and payments) and `/records` (paged trips, cars, hotels, payments).
- **Admin:** the same pages with everyone's data, plus `/admin/users` (search, change roles) and `/admin/products` (edit, delete) and `/addproduct`.
Pages for another role show "No access"; the API enforces the same rules.

## Routes
`/` · `/signin` · `/signup` · `/booktrip` · `/touractivity` · `/bookcar` · `/hotelbooking` · `/travelstyle` · `/travelplan` · `/addproduct` (admin) · `/dashboard` · `/records` · `/admin/users` · `/admin/products` · `/chatbot` · detail pages `/trip-details`, `/activity-details`, `/car-details`, `/hotel-details`, `/style-details` (open them from a list; they read the item from router state).
