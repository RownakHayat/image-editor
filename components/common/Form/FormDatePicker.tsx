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
  type?: string,
  className?: string,
  style?: any,
  disabled?: boolean,
  remark?: true | false
}

type IDatePicker = {
  name: string
  disabled?: boolean
  setError?: string
  showIcon?: boolean
} & InputFieldProps

const InputDate = forwardRef((props: any, ref: any) => {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        ref={ref}
        {...props}
        className="border-[1px] rounded-md  border-[#cccccc] bg-white mt-2 w-[100%]"
      />
      {props.showIcon !== false && ( // Conditionally render the icon
        <Icons.calender {...props} className="w-5 h-5 absolute top-1/2 right-2 transition translate -translate-y-1/2" />
      )}
    </div>
  )
})

const FormDatePicker: FC<IDatePicker> = ({ name, disabled, setError, showIcon = true, ...otherProps }) => {

  const { control, getValues, formState: { errors } }: any = useFormContext();

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, ref, value, ...restField } }) => {
          return (<>
            <div className="w-full">
              <div className="">
                <Label className="text-[#4B5563]">{otherProps.label}<span className="text-red-500 pl-1" >{otherProps?.remark && '*'} </span></Label>
              </div>
              <div className="w-full ">
                <ReactDatePicker
                  selected={value ? new Date(value) : undefined}
                  onChange={(date) => {
                    if (date === null) {
                      onChange("");
                    } else {
                      // onChange(date?.toString())
                      // Format the date as "yyyy-MM-dd"
                        onChange(new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0]);
                    }
                  }}
                  dateFormat={"dd MMM YYYY"}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  autoComplete='off'
                  disabled={disabled ? disabled : false}
                  wrapperClassName='datepicker'
                  showIcon={showIcon}
                  customInput={
                    <InputDate type='text' className="w-full" style={{ width: "" }} />
                  }
                />
                {errors?.[name] && (
                  <p className="text-sm font-medium text-destructive text-red-500">
                    {errors[name]?.message}
                  </p>
                )}
                {/* {!getValues(`${name}`) ? <p className="text-sm font-medium text-destructive text-red-500">{errors?.[name]?.message || ""}</p> : ""} */}
              </div>
            </div>
          </>)
        }}
      />

    </>
  );
}

export default FormDatePicker
