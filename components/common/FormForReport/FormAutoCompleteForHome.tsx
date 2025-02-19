"use client";

import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

export function FormAutoCompleteForReportHome({
    name,
    singleListName,
    data,
    staticOptions = [],
    isDisabled,
    defaultValue, // Accept defaultValue as a prop
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

    return (
      <>
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const selectedValue = combinedOptions.find(
              (option) => option.value === field.value
            );

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
                    className={`${otherProps.label && "mt-2"} border-[0px] rounded-md text-black border-gray-500`}
                    isDisabled={isDisabled}
                    options={combinedOptions}
                    isClearable
                    value={
                      selectedValue ||
                      combinedOptions.find((option) => option.value === defaultValue) ||
                      null
                    }
                    onChange={(selectedOption: any) => {
                      if (selectedOption?.value === "selectAll") {
                        setValue(name, "selectAll");
                        field.onChange("selectAll");
                      } else {
                        setValue(name, selectedOption?.value || "");
                        field.onChange(selectedOption?.value || "");
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
            );
          }}
        />
      </>
    );
  }
