import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
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
  exercises: Record<number, Set[]>;
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

  const { control, handleSubmit, register, setValue, getValues } =
    useForm<WorkoutForm>({
      defaultValues: {
        selectedDate: new Date(),
        exercises: {},
      },
    });

  useEffect(() => {
    const selectedWorkout = fakeData.find((w) => w.id === parseInt(id!));
    if (selectedWorkout) {
      const initialExercisesState: any = {};
      selectedWorkout.exercises.forEach((exercise: Exercise) => {
        initialExercisesState[exercise.id] = [
          { reps: "", weight: "", rest: "" }, // one set by default
        ];
      });

      setWorkout(selectedWorkout);
      setValue("exercises", initialExercisesState as Record<number, Set[]>); // Typecast to Record<number, Set[]>
    }
  }, [id, setValue]);

  const onSubmit = (data: WorkoutForm) => {
    const result = workout.exercises.flatMap((exercise: Exercise) => {
      return (
        data.exercises[exercise.id]?.map((set: Set) => ({
          "workout-id": id,
          name: exercise.name,
          reps: parseInt(set.reps),
          weight: parseInt(set.weight),
          rest: parseInt(set.rest),
        })) || []
      );
    });

    console.log(result);
  };

  const addSet = (exerciseId: number) => {
    const prev = getValues(`exercises.${exerciseId}`) || [];
    setValue(`exercises.${exerciseId}`, [
      ...prev,
      { reps: "", weight: "", rest: "" },
    ] as Set[]); // Typecast to Set[]
  };

  const removeSet = (exerciseId: number, index: number) => {
    const prev = getValues(`exercises.${exerciseId}`) || [];
    prev.splice(index, 1);
    setValue(`exercises.${exerciseId}`, [...prev] as Set[]); // Typecast to Set[]
  };

  if (!workout) return <div>Loading...</div>;

  return (
    <div className="workout-screen">
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

        {workout.exercises.map((exercise: Exercise) => (
          <div key={exercise.id} className="exercise-block">
            <h3 className="exercise-button log-button">{exercise.name}</h3>
            <div className="set-table">
              {getValues(`exercises.${exercise.id}`)?.map(
                (_, setIndex: number) => (
                  <div key={setIndex} className="set-row">
                    <input
                      type="number"
                      placeholder="Reps"
                      {...register(
                        `exercises.${exercise.id}.${setIndex}.reps` as any
                      )}
                    />
                    <input
                      type="number"
                      placeholder="Weight"
                      {...register(
                        `exercises.${exercise.id}.${setIndex}.weight` as any
                      )}
                    />
                    <input
                      type="number"
                      placeholder="Rest (sec)"
                      {...register(
                        `exercises.${exercise.id}.${setIndex}.rest` as any
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => removeSet(exercise.id, setIndex)}
                    >
                      Remove Set
                    </button>
                  </div>
                )
              )}
            </div>
            <button type="button" onClick={() => addSet(exercise.id)}>
              + Add Set
            </button>
          </div>
        ))}

        <button type="submit" className="home-button create-button">
          Save Workout
        </button>
      </form>
    </div>
  );
};
