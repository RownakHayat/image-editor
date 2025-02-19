import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  style?: any;
  disabled?: boolean;
  remark?: boolean;
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

type FormChangePasswordProps = {
  name: string;
} & InputFieldProps;

const FormChangePassword: FC<FormChangePasswordProps> = ({
  name,
  className,
  remark,
  bengaliAllow = false,
  ...otherProps
}) => {
  const {
    control,
    setValue,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext() ?? {};
  const isInvalid = errors[name];
  const watchedValue = watch(name);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const regex = /^[^\u0980-\u09FF]*$/;

    if (regex.test(inputValue)) {
      setValue(name, inputValue);
      otherProps.onChange && otherProps.onChange(e);
      trigger(name);
    } else {
      alert("Please Type in English");
      setValue(name, "");
      e.target.value = "";
      otherProps.onChange &&
        otherProps.onChange({
          ...e,
          target: {
            ...e.target,
            value: "",
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
        <FormItem className="flex flex-col justify-between w-full">
          {otherProps.label && (
            <div className=" relative">
              <Label className="text-[#4B5563] relative">{otherProps.label}</Label>
              {remark && (
              <span className="text-red-500 pl-1 absolute top-1/2 transform -translate-y-1/2">
                *
              </span>
            )}
            </div>
          )}
          <div className={`${otherProps.label && "basis-2/4"} relative w-full`}>
            <FormControl className="m-0 p-0">
              <div className="relative">
                <Input
                  {...field}
                  {...otherProps}
                  type={isPasswordVisible ? "text" : "password"}
                  className={cn(
                    "bg-white border-[1px] rounded-md outline-none px-2 pr-10",
                    isInvalid ? "border-red-500" : "border-[#cccccc]",
                    className
                  )}
                  onChange={bengaliAllow ? field.onChange : handleChange}
                />
                <span
                  className="cursor-pointer absolute top-1/2 right-3 transform -translate-y-1/2"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <Eye />  :   <EyeOff />}
                </span>
              </div>
            </FormControl>
            {/* {remark && (
              <span className="text-red-500 pl-1 absolute top-1/2 right-[-14px] transform -translate-y-1/2">
                *
              </span>
            )} */}
          </div>
          {isInvalid && <FormMessage className="absolute-bottom-6 " />}
        </FormItem>
      )}
    />
  );
};

export default FormChangePassword;
