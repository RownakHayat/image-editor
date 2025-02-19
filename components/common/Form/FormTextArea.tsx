import { FC } from "react"
import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface InputFieldProps {
  label?: string
  placeholder?: string
  value?: string
  type?: string,
  className?: string,
  style?: any,
  disabled?: boolean,
  remark?: true | false
  min?: any
  rows?: any
  cols?: any
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

type FormInputProps = {
  name: string,
} & InputFieldProps

const FormTextArea: FC<FormInputProps> = ({ name,onChange, ...otherProps }) => {
    const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {otherProps.label &&
            <div className="flex justify-between items-center basis-2/4">
              <Label className="text-[#4B5563] leading-6 text-wrap">{otherProps.label}<span className="text-red-500 pl-1" >{otherProps?.remark && '*'} </span></Label>
            
            </div>
          }
          <div className={`${otherProps.label && "basis-2/4"} relative`}>
            <FormControl className="m-0 p-0" >
            <Textarea
                rows={otherProps?.rows}
                cols={otherProps?.cols}
                {...field}
                {...otherProps}
                onChange={(e:any) => {
                  field.onChange(e); // Update the form state
                  onChange?.(e); // Call the passed onChange handler
                }}
                className={`bg-white border-[1px] rounded-md border-[#cccccc] p-2`}
              />
            </FormControl>
            <FormMessage className="absolute -bottom-6" />
          </div>
        </FormItem>
      )}
    />
  )
}

export default FormTextArea
