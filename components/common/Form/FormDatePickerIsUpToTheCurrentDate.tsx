import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FC, forwardRef } from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Controller, useFormContext } from "react-hook-form"

interface InputFieldProps {
  label?: string
  placeholder?: string
  type?: string
  className?: string
  style?: any
  disabled?: boolean
  remark?: true | false
}

type IDatePicker = {
  name: string
  disabled?: boolean
  setError?: string
  showIcon?: boolean
  minDate?: string
  maxDate?: string
  onChange?: (date: any) => void // Add onChange to the type
} & InputFieldProps

// Define InputDate here
const InputDate = forwardRef((props: any, ref: any) => {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        ref={ref}
        {...props}
        className="border-[1px] rounded-md  border-[#cccccc] bg-white mt-2 w-[100%]"
      />
      {props.showIcon !== false && (
        <Icons.calender
          {...props}
          className="w-5 h-5 absolute top-1/2 right-2 transition translate -translate-y-1/2"
        />
      )}
    </div>
  )
});

const FormDatePickerToDateBigerThenFromDate: FC<IDatePicker> = ({
  name,
  disabled,
  setError,
  showIcon = true,
  minDate,
  maxDate,
  onChange, // Accept the onChange prop
  ...otherProps
}) => {
  const { control, formState: { errors } }: any = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange: fieldOnChange, ref, value, ...restField } }) => {
          return (
            <>
              <div className="w-full">
                <div>
                  <Label className="text-[#4B5563]">
                    {otherProps.label}
                    <span className="text-red-500 pl-1">{otherProps?.remark && '*'}</span>
                  </Label>
                </div>
                <div className="w-full">
                  <ReactDatePicker
                    selected={value ? new Date(value) : undefined}
                    onChange={(date) => {
                      const formattedDate = date
                        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0]
                        : "";
                      fieldOnChange(formattedDate); // Pass to react-hook-form
                      if (onChange) {
                        onChange(formattedDate); // Pass to the custom onChange prop
                      }
                    }}
                    dateFormat={"dd MMM yyyy"}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    autoComplete='off'
                    disabled={disabled ? disabled : false}
                    wrapperClassName='datepicker'
                    showIcon={showIcon}
                    minDate={minDate ? new Date(minDate) : undefined} // Handle minDate
                    maxDate={maxDate ? new Date(maxDate) : undefined} // Handle maxDate
                    customInput={<InputDate type='text' className="w-full" />}
                  />
                  {errors?.[name] && (
                    <p className="text-sm font-medium text-destructive text-red-500">
                      {errors[name]?.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          );
        }}
      />
    </>
  );
};



export default FormDatePickerToDateBigerThenFromDate;
