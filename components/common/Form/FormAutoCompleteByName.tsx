"use client";

import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

export function FormAutoCompleteByName({ name, singleListName, data, isDisabled, ...otherProps }: any) {
    const { control, setValue, formState: { errors } }: any = useFormContext();

    const isInvalid = errors[name];

    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <div className="flex flex-col justify-between">
                        {otherProps.label && (
                            <div className="basis-1/2">
                                <Label className="text-[#4B5563]">
                                    {otherProps.label}
                                    <span className="text-red-500 pl-1">
                                        {otherProps?.remark && '*'}
                                    </span>
                                </Label>
                            </div>
                        )}

                        <div className={`${otherProps.label && "basis-1/2"} relative w-full`}>
                            <Select
                                {...otherProps}
                                className={`${otherProps.label && "mt-2"} border-[0px] rounded-md border-gray-500`}
                                isDisabled={isDisabled ? true : false}
                                options={data?.map((item: any) => ({
                                    value: item.id.toString(),
                                    label: item[`${singleListName}_name`],
                                }))}
                                isClearable
                                value={field.value ? data.find((option: any) => option.label === field.value) : null}
                                onChange={(selectedOption: any) => {
                                    setValue(name, selectedOption ? selectedOption.label : ""); // Store the label (name) instead of id
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