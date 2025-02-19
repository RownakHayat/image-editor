import { FC, useEffect } from "react";
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
    placeholder?: string;
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
}

type FormInputSignupProps = {
    name: string;
} & InputFieldProps;

const FormInputSignup: FC<FormInputSignupProps> = ({ name, className, remark, bengaliAllow = false, ...otherProps }) => {
    const { control, setValue, formState: { errors }, trigger, watch } = useFormContext() ?? {};
    const isInvalid = errors[name];
    const watchedValue = watch(name);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const regex = /^[^\u0980-\u09FF]*$/;

        if (regex.test(inputValue)) {
            setValue(name, inputValue);
            otherProps.onChange && otherProps.onChange(e);
            trigger(name);
        } else {
            alert('Please Type in English');
            setValue(name, '');
            e.target.value = '';
            otherProps.onChange && otherProps.onChange({
                ...e,
                target: {
                    ...e.target,
                    value: '',
                },
            });
        }
    };

    useEffect(() => {
        if (watchedValue && (name === "password" || name === "confirmPassword")) {
            trigger("password");
            trigger("confirmPassword");
        }
    }, [watchedValue, trigger, name]);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <FormItem className="flex flex-col justify-between w-full mt-2">
                    {otherProps.label && (
                        <div className="basis-2/4">
                            <Label className="text-[#4B5563]">
                                {otherProps.label}
                            </Label>
                        </div>
                    )}
                    <div className={`${otherProps.label && "basis-2/4"} relative w-full`}>
                        <FormControl className="m-0 p-0">
                            <Input
                                {...field}
                                {...otherProps}
                                className={cn(
                                    "bg-white border-[1px] rounded-md outline-none px-2",
                                    isInvalid ? "border-red-500" : "border-[#cccccc]",
                                    className
                                )}
                                onChange={bengaliAllow ? field.onChange : handleChange}
                            />
                        </FormControl>
                        {remark && <span className="text-red-500 pl-1 absolute top-[50%] right-[-14px] transform -translate-y-1/2">*</span>}
                    </div>
                    {isInvalid && <FormMessage className="absolute-bottom-6 mt-2" />}
                </FormItem>
            )}
        />
    );
};

export default FormInputSignup;
