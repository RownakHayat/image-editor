"use client"
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

export function FormAutoCompleteMultiSelect({ name, singleListName, data, isDisabled, ...otherProps }: any) {
    const { control, setValue, formState: { errors } } = useFormContext();

    const error = errors[name] && (errors[name] as any)?.message;
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <div className="flex flex-col justify-between">
                    {otherProps.label && (
                        <div className="basis-1/2">
                            <Label className="text-[#4B5563]">
                                {otherProps.label}
                                {otherProps?.remark && <span className="text-red-500 pl-1">*</span>}
                            </Label>
                        </div>
                    )}

                    <div className={`${otherProps.label && "basis-1/2"} relative w-full`}>
                        <Select
                            {...otherProps}
                            className={`${otherProps.label && "mt-2"} border-[0px] rounded-md  border-gray-500`}
                            isDisabled={isDisabled}
                            options={data.map((item: any) => ({
                                value: item.id.toString(),
                                label: item[`${singleListName}_name`],
                            }))}
                            isMulti
                            value={data
                                .filter((item: any) => (field.value || []).includes(item.id.toString()))
                                .map((item: any) => ({ value: item.id.toString(), label: item[`${singleListName}_name`] }))}
                            onChange={(selectedOptions: any) => {
                                const selectedValues = selectedOptions.map((option: any) => option.value);
                                setValue(name, selectedValues);
                            }}
                        />
                        {error && (
                            <p className="text-sm font-medium text-red-500 absolute mt-2">
                                {error.toString()}
                            </p>
                        )}
                    </div>
                </div>
            )}
        />
    );
}
