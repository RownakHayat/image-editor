import { useAuthUserQuery } from "@/store/features/UserManagement/User";
import { useEffect, useState } from "react";

export const MIN = 0;
export const MAX = 100;


export default function ProgressBar({ value = 0, onComplete = () => { } }) {
  const [percent, setPercent] = useState(value);


  useEffect(() => {
    setPercent(Math.min(Math.max(value, MIN), MAX));

    if (value >= MAX) {
      onComplete();
    }
  }, [value]);

  const getProgressColor = (value: any) => {
    if (value < 50) return "bg-red-500";
    if (value < 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  const { data: userInfo } = useAuthUserQuery();

  return (
    <>

      {userInfo?.data?.role?.id === 3 ? (
        <>
          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full ${getProgressColor(percent)}`}
              style={{
                width: `${percent}%`,
              }}
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={percent}
              role="progressbar"
            />
            <span
              className="absolute inset-0 flex items-center justify-center text-sm font-medium"
              style={{
                color: percent > 49 ? "white" : "black",
              }}
            >
              {percent?.toFixed()}%
            </span>
          </div>
        </>
      ) : null}


    </>
  );
}
