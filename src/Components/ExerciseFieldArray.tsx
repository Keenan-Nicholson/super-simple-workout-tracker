import { useFieldArray, UseFormRegister, Control } from "react-hook-form";

interface ExerciseFieldArrayProps {
  exerciseIndex: number;
  exerciseName: string;
  control: Control<any>;
  register: UseFormRegister<any>;
}

export const ExerciseFieldArray = ({
  exerciseIndex,
  exerciseName,
  control,
  register,
}: ExerciseFieldArrayProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  return (
    <div className="exercise-block">
      <h3 className="exercise-button log-button">{exerciseName}</h3>
      <div className="set-table">
        {fields.map((field, setIndex) => (
          <div key={field.id} className="set-row">
            <input
              type="number"
              placeholder="Reps"
              {...register(`exercises.${exerciseIndex}.sets.${setIndex}.reps`)}
            />
            <input
              type="number"
              placeholder="Weight"
              {...register(
                `exercises.${exerciseIndex}.sets.${setIndex}.weight`
              )}
            />
            <input
              type="number"
              placeholder="Rest (sec)"
              {...register(`exercises.${exerciseIndex}.sets.${setIndex}.rest`)}
            />
          </div>
        ))}
      </div>
      <div className="set-buttons-row">
        <button
          type="button"
          className="add-set-button"
          onClick={() => append({ reps: "", weight: "", rest: "" })}
        >
          + Set
        </button>
        <button
          type="button"
          className="remove-set-button"
          onClick={() => {
            if (fields.length > 1) remove(fields.length - 1);
          }}
          disabled={fields.length === 1}
        >
          - Set
        </button>
      </div>
    </div>
  );
};
