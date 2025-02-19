import { Label } from "@/components/ui/label";
import { FC } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useFormContext } from "react-hook-form";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  style?: any;
  disabled?: boolean;
  remark?: boolean; // Corrected type
}

type IDatePicker = {
  name: string;
  disabled?: boolean;
  setError?: string;
  renderYearContent?: (year: number) => JSX.Element | string;
} & InputFieldProps;

const FormYearPicker: FC<IDatePicker> = ({
  name,
  disabled,
  setError,
  renderYearContent,
  ...otherProps
}) => {
  const { control, getValues, formState: { errors } }: any = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <div className="flex justify-between items-center w-full">
          <div className="flex justify-between items-center ">
            <Label className="text-[#4B5563]">
              {otherProps.label}
              {otherProps?.remark && <span className="text-red-500 pl-1">*</span>}
            </Label>
            {otherProps.label && <div className="mr-2">:</div>}
          </div>
          <div className="w-full relative">
            <select
              value={value ? new Date(value).getFullYear() : ""}
              onChange={(e) => {
                onChange(e.target.value ? `${e.target.value}` : "");
              }}
              disabled={disabled}
              className="border-[1px] rounded-md border-[#cccccc] bg-white p-[8px] w-full"
            >
              <option value="" >Year</option>
              {renderYearOptions()}
            </select>
            {!getValues(name) && (
              <p className="text-sm font-medium text-destructive absolute">
                {errors?.[name]?.message || ""}
              </p>
            )}
          </div>
        </div>
      )}
    />
  );
};

const renderYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(50), (val, index) => currentYear - index);

  return years.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ));
};

export default FormYearPicker;
