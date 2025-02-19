import { FC } from "react";
import { useFormContext } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputFieldProps {
    label?: string;
    placeholder?: any;
    type?: string;
    className?: string;
    style?: any;
    disabled?: boolean;
    remark?: boolean; // Changed type to boolean
    bengaliAllow?: boolean;
    min?: any;
    max?: any;
    minlength?: any;
    maxlength?: any;
    pattern?: any;
    inputmode?: any;
    onChange?: any;
    value?: any;
    autoComplete?: string;
    defaultValue?: any;
}

type FormInputProps = {
    name: string;

} & InputFieldProps;

const FormInput: FC<FormInputProps> = ({ name, className, value,remark, bengaliAllow = false, autoComplete = "off", ...otherProps }) => {
    // const { control, setValue, formState: { errors } } = useFormContext() ?? {};
    const { control, setValue, formState: { errors = {} } } = useFormContext() || {};
    const isInvalid = errors[name] !== undefined;
    // const isInvalid = errors[name];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const regex = /^[^\u0980-\u09FF]*$/;

        if (regex.test(inputValue)) {
            setValue(name, inputValue); // Update the form's value
            otherProps.onChange && otherProps.onChange(e);
        } else {
            alert('Please Type in English');
            setValue(name, ''); // Set value to empty string
            e.target.value = ''; // Update the input field directly
            otherProps.onChange && otherProps.onChange({
                ...e,
                target: {
                    ...e.target,
                    value: '',
                },
            });
        }
    };


    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => {

                return (
                    <FormItem className="flex flex-col justify-between w-full">
                        {otherProps.label && (
                            <div className="basis-2/4">
                                <Label className="text-[#4B5563]">
                                    {otherProps?.label}
                                    {remark && <span className="text-red-500 pl-1">*</span>}
                                </Label>
                            </div>
                        )}
                        {/* <div className={`${otherProps.label && "basis-2/4"} relative w-full`}> */}
                        <div className={`${otherProps.label ? "basis-2/4" : ""} relative w-full`}>
                            <FormControl className="m-0 p-0">
                                <Input
                                    {...field}
                                    {...otherProps}
                                    value={value ?? field.value ?? ""}
                                    className={cn(
                                        "bg-white border-[1px] rounded-md outline-none px-2",
                                        isInvalid ? "border-red-500" : "border-[#cccccc]",
                                        className
                                    )}
                                    onChange={bengaliAllow ? field.onChange : handleChange}
                                />
                            </FormControl>
                            {isInvalid && <FormMessage className="absolute-bottom-6 text-red-500 pt-2" />}
                        </div>
                    </FormItem>
                )
            }}
        />
    );
};

export default FormInput;
