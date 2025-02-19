"use client";

import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

export function FormAutoCompleteForReport({
    name,
    singleListName,
    data,
    staticOptions = [],
    isDisabled,
    ...otherProps
}: any) {
    const { control, setValue, formState: { errors } }: any = useFormContext();

    const isInvalid = errors[name];

    // Combine static options with dynamic options
    const combinedOptions = [
        ...staticOptions,
        ...data.map((item: any) => ({
            value: item.id.toString(), // ID as value
            label: item[`${singleListName}_name`], // Display name as label
        })),
    ];

    const customStyles = {

        placeholder: (provided: any, state: any) => ({
          ...provided,
        //   fontSize: '15px',
          color: '#545454',

        }),

      };

    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field }) => {
                    const selectedValue = field.value === "selectAll"
                        ? combinedOptions.find((option) => option.value === "selectAll")
                        : combinedOptions.find((option) => option.value === field.value);

                    return (
                        <div className="flex flex-col justify-between">
                            {otherProps.label && (
                                <div className="basis-1/2">
                                    <Label className="text-[#4B5563]">
                                        {otherProps.label}
                                        <span className="text-red-500 pl-1">
                                            {otherProps?.remark && "*"}
                                        </span>
                                    </Label>
                                </div>
                            )}

                            <div className={`${otherProps.label && "basis-1/2"} relative w-full`}>
                                <Select
                                    {...otherProps}
                                    className={`${otherProps.label && "mt-2"} border-[0px] rounded-md border-gray-500`}
                                    isDisabled={isDisabled}
                                    options={combinedOptions}
                                    isClearable
                                    value={selectedValue || null}
                                    onChange={(selectedOption: any) => {
                                        if (selectedOption?.value === "selectAll") {
                                            setValue(name, "selectAll"); // Set "selectAll" explicitly
                                            field.onChange("selectAll");
                                        } else {
                                            setValue(name, selectedOption?.value || ""); // Set the ID as value
                                            field.onChange(selectedOption?.value || "");
                                        }
                                    }}
                                    styles={customStyles}
                                />
                                {isInvalid && (
                                    <p className="text-sm font-medium text-red-500 mt-2">
                                        {errors[name]?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                }}
            />
        </>
    );
}