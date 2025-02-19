"use client";

import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

export function FormAutoCompleteByNameForReport({
    name,
    singleListName,
    data,
    staticOptions = [],
    isDisabled,
    ...otherProps
}: any) {
    const { control, setValue, formState: { errors } }: any = useFormContext();

    const isInvalid = errors[name];

    const combinedOptions = [
        ...staticOptions,
        ...data.map((item: any) => ({
            value: item.id.toString(),
            label: item[`${singleListName}_name`],
        })),
    ];

    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <div className="flex flex-col justify-between mt-2">
                        {otherProps.label && (
                            <Label className="text-[#4B5563]">
                                {otherProps.label}
                                <span className="text-red-500 pl-1">
                                    {otherProps?.remark && '*'}
                                </span>
                            </Label>
                        )}

                        <div className="relative w-full">
                            <Select
                                {...otherProps}
                                className="mt-2 border-[0px] rounded-md border-gray-500"
                                isDisabled={isDisabled}
                                options={combinedOptions}
                                isClearable
                                value={field.value ? combinedOptions.find((option: any) => option.label === field.value): null}
                                 onChange={(selectedOption: any) => {
                                    // Prevent sending the static option value
                                    if (selectedOption?.value === "selectAll") {
                                        setValue(name, "selectAll", ""); // Clear the value for "Select All"
                                    } else {
                                        setValue(name, selectedOption?.label || "");
                                    }
                                }}
                            />
                            {isInvalid && (
                                <p className="text-sm font-medium text-red-500 mt-2">
                                    {errors[name]?.message}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            />
        </>
    );
}
