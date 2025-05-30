import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { ExerciseFieldArray } from "./ExerciseFieldArray";
import "react-datepicker/dist/react-datepicker.css";

interface Set {
  reps: string;
  weight: string;
  rest: string;
}

interface RawWorkout {
  id: number;
  name: string;
  exercises: string; // still stringified
}

interface Workout {
  id: number;
  name: string;
  exercises: string[]; // now an array of names like ["Curl", "Row"]
}

interface Exercise {
  name: string;
  sets: Set[];
}

interface WorkoutForm {
  selectedDate: Date;
  exercises: Exercise[];
}

export const Workout = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const { control, handleSubmit, register, setValue, getValues } =
    useForm<WorkoutForm>({
      defaultValues: {
        selectedDate: new Date(),
        exercises: [],
      },
    });

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:3000/workouts");
        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }
        const data: RawWorkout[] = await response.json();

        const selectedWorkout = data.find((w) => w.id === parseInt(id!));

        if (selectedWorkout) {
          const exercisesArray: string[] = JSON.parse(
            selectedWorkout.exercises
          );

          const workout: Workout = {
            id: selectedWorkout.id,
            name: selectedWorkout.name,
            exercises: exercisesArray,
          };

          setWorkout(workout);

          // Create default exercise objects for the form
          const defaultExercises: Exercise[] = exercisesArray.map((name) => ({
            name,
            sets: [{ reps: "", weight: "", rest: "" }],
          }));

          setValue("exercises", defaultExercises);
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, [id, setValue]);

  const onSubmit = (data: WorkoutForm) => {
    const result = data.exercises.flatMap((exercise) =>
      exercise.sets.map((set) => ({
        "workout-id": id,
        date: data.selectedDate.toISOString().split("T")[0],
        name: exercise.name,
        reps: parseInt(set.reps),
        weight: parseInt(set.weight),
        rest: parseInt(set.rest),
      }))
    );
    console.log("Submitting:", result);
    const postWorkout = async () => {
      try {
        const response = await fetch("http://localhost:3000/logged_sets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });

        if (!response.ok) {
          throw new Error("Failed to save workout");
        }
      } catch (error) {
        console.error("Error saving workout:", error);
      }
    };

    postWorkout();
  };

  if (!workout) return <div>Loading...</div>;

  return (
    <div className="workout-screen">
      <h1 className="title">{workout.name}</h1>
      <form className="exercise-list" onSubmit={handleSubmit(onSubmit)}>
        <div className="date-picker-container">
          <Controller
            name="selectedDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(date) => field.onChange(date)}
                dateFormat="yyyy-MM-dd"
                className="date-picker"
              />
            )}
          />
        </div>

        {/* Rendering exercises from form state, not raw workout */}
        {getValues("exercises").map((exercise, index) => (
          <ExerciseFieldArray
            key={index}
            exerciseIndex={index}
            exerciseName={exercise.name}
            control={control}
            register={register}
          />
        ))}

        <button type="submit" className="home-button create-button">
          Save Workout
        </button>
      </form>
    </div>
  );
};
