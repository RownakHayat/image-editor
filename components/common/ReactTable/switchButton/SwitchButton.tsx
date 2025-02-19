import { useEffect, useState } from "react";
import useToast from "../../hooks/useToast";

function SwitchButton(props: any) {
  const { updateAPI, data } = props;
  const [on, setOn] = useState(data?.status === 1);
  const { ToastSuccess, ToastError } = useToast();

  useEffect(() => {
    setOn(data?.status === 1);
  }, [data]);

  const handleClick = () => {
    const newStatus = on ? 0 : 1;
    updateAPI({ ...data, status: newStatus })
      .then((res: any) => {
        if (res?.data?.code === 200) {
          setOn(!on);
          // ToastSuccess("Status has been changed");
          if (!on) {
            ToastSuccess("Status has been changed to Active");
          } else {
            ToastSuccess("Status has been changed to Inactive");
          }
        } else {

          const errorMessage =
          res?.error?.data?.errors?.[0]?.message || res?.error?.data?.message;
        ToastError(errorMessage);
        }
      })
      .catch((err: any) => {
        ToastError("Error occurred while changing status");
      });
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleClick}
        className={`flex h-[20px] w-[55px] rounded p-0 text-xs shadow-2xl ring-1 ring-[#cac2c2] transition duration-1000
        ${on ? "focus:ring-[#cac2c2 focus:ring-1" : "focus:ring-1 focus:ring-[#cac2c2]"}
        ${on ? "justify-end" : "justify-start"} ${on ? "bg-white ring-1 ring-success" : "bg-white"}`}
      >
        <span
          className={`m-0 h-full w-[20px] rounded ${on
              ? "bg-success font-bold text-xs text-success ring-1 ring-success"
              : "bg-[#F052521A] font-bold text-xs text-[#F05252] ring-1 ring-[#F05252]"
            } flex items-center justify-center transition duration-1000 px-3`}
        >
          {/* {on ? "ON" : "OFF"} */}
        </span>
      </button>
    </div>
  );
}

export default SwitchButton;
