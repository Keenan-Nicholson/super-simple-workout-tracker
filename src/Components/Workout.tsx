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

interface Exercise {
  id: number;
  name: string;
}

interface WorkoutForm {
  selectedDate: Date;
  exercises: {
    id: number;
    name: string;
    sets: Set[];
  }[];
}

const fakeData = [
  {
    id: 1,
    name: "Arm Day",
    exercises: [
      { id: 101, name: "Bench Press" },
      { id: 102, name: "Barbell Curl" },
      { id: 103, name: "Dumbbell Curl" },
      { id: 104, name: "Hammer Curl" },
    ],
  },
];

export const Workout = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState<any>(null);

  const { control, handleSubmit, register, setValue } = useForm<WorkoutForm>({
    defaultValues: {
      selectedDate: new Date(),
      exercises: [],
    },
  });

  useEffect(() => {
    const selectedWorkout = fakeData.find((w) => w.id === parseInt(id!));
    if (selectedWorkout) {
      const defaultExercises = selectedWorkout.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        sets: [{ reps: "", weight: "", rest: "" }],
      }));

      setWorkout(selectedWorkout);
      setValue("exercises", defaultExercises);
    }
  }, [id, setValue]);

  const onSubmit = (data: WorkoutForm) => {
    const result = data.exercises.flatMap((exercise) =>
      exercise.sets.map((set) => ({
        "workout-id": id,
        date: data.selectedDate,
        name: exercise.name,
        reps: parseInt(set.reps),
        weight: parseInt(set.weight),
        rest: parseInt(set.rest),
      }))
    );

    console.log(result);
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
                dateFormat="yyyy/MM/dd"
                className="date-picker"
              />
            )}
          />
        </div>

        {workout.exercises.map((exercise: Exercise, index: number) => (
          <ExerciseFieldArray
            key={exercise.id}
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
