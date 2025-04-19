import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Define the types for the form data
interface Set {
  reps: string;
  weight: string;
  rest: string;
}

interface Exercise {
  id: number;
  name: string;
  sets: Set[];
}

interface WorkoutForm {
  selectedDate: Date;
  exercises: Exercise[];
}

// Sample data for testing
const fakeData = [
  { id: 1, name: "Arm Day", exercises: [{ id: 1, name: "Bicep Curl" }] },
  { id: 2, name: "Leg Day", exercises: [{ id: 2, name: "Squat" }] },
  { id: 3, name: "Push Day", exercises: [{ id: 3, name: "Bench Press" }] },
];

export const Workout = () => {
  const { id } = useParams();
  // Change workout state type to hold the full structure
  const [workout, setWorkout] = useState<{
    id: number;
    name: string;
    exercises: Exercise[];
  } | null>(null);

  const { control, register, handleSubmit, setValue } = useForm<WorkoutForm>({
    defaultValues: {
      selectedDate: new Date(),
      exercises: [], // Empty array initially
    },
  });

  const { fields: exerciseFields, append: _appendExercise } = useFieldArray({
    control,
    name: "exercises", // Path to exercises array
  });

  useEffect(() => {
    const selectedWorkout = fakeData.find((w) => w.id === parseInt(id!));

    if (selectedWorkout) {
      const exerciseData = selectedWorkout.exercises.map((exercise: any) => ({
        id: exercise.id,
        name: exercise.name,
        sets: [{ reps: "", weight: "", rest: "" }],
      }));

      // Set the workout with the right structure
      setWorkout({
        id: selectedWorkout.id,
        name: selectedWorkout.name,
        exercises: exerciseData,
      });

      setValue("exercises", exerciseData); // Set the exercises for the workout
    } else {
      setWorkout(null); // Handle the case where no workout is found
    }
  }, [id, setValue]); // Properly place the dependencies

  const { fields: _setFields, append } = useFieldArray({
    control,
    name: `exercises.${0}.sets`, // Path to sets array of the first exercise
  });

  const addSetToExercise = (_exerciseIndex: number) => {
    append({ reps: "", weight: "", rest: "" }); // Add a new set to the exercise
  };
  const onSubmit = (data: WorkoutForm) => {
    console.log("Workout data:", data);
  };

  if (!workout) {
    return <div>Loading...</div>;
  }

  return (
    <form className="workout-screen" onSubmit={handleSubmit(onSubmit)}>
      <h1>{workout.name}</h1>
      <div className="date-picker-container">
        <label htmlFor="workout-date">Date</label>
        <Controller
          name="selectedDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              className="date-picker"
            />
          )}
        />
      </div>

      <div className="exercise-list">
        {exerciseFields.map((exercise, index) => (
          <div key={exercise.id} className="exercise-block">
            <button type="button" className="exercise-button log-button">
              {exercise.name}
            </button>

            <div className="set-table">
              <Controller
                control={control}
                name={`exercises.${index}.sets`}
                render={({ field }) => (
                  <>
                    {field.value?.map((_, setIndex: number) => (
                      <div key={setIndex} className="set-row">
                        <input
                          type="number"
                          placeholder="Reps"
                          {...register(
                            `exercises.${index}.sets.${setIndex}.reps`
                          )}
                        />
                        <input
                          type="number"
                          placeholder="Weight"
                          {...register(
                            `exercises.${index}.sets.${setIndex}.weight`
                          )}
                        />
                        <input
                          type="number"
                          placeholder="Rest (sec)"
                          {...register(
                            `exercises.${index}.sets.${setIndex}.rest`
                          )}
                        />
                      </div>
                    ))}
                  </>
                )}
              />
            </div>

            <button
              type="button"
              onClick={() => addSetToExercise(index)}
              className="add-set-button"
            >
              + Add Set
            </button>
          </div>
        ))}
      </div>

      <button type="submit" className="exercise-button log-button">
        Save Workout
      </button>
    </form>
  );
};
