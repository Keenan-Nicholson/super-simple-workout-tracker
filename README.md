# Super Simple Workout Tracker

A **minimalist**, **mobile-first** workout tracker designed for simplicity. Log your workouts, create new ones, and track your progress with ease. This app uses a straightforward interface, perfect for users who want a **no-frills** experience.

---

## Features

**Create Workouts**  
 Create a workout plan with multiple exercises. 📝

**Log Workouts**  
 Record the details for each exercise, including:

- Reps 🔢
- Weights 🏋️
- Rest period ⏱️

**View, Edit and Export Your Workout History**

- Quickly browse your past sessions 📅
- Edit workout entries in case of mistakes ✏️
- Export data to CSV 📤

## Self-Hosting with Docker Compose

You can easily run **Super Simple Workout Tracker** on your own server using Docker Compose.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/super-simple-workout-tracker.git
cd super-simple-workout-tracker
```

### 2. Set Environment Variables

`EXPRESS_PORT` for the backend
`APP_PORT` for the frontend

### 3. Start the Docker Container

`docker-compose up --build -d`
