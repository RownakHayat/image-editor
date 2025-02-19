"use client";

import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

// Define custom styles
const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        minHeight: 'auto',
        height: 'auto',
        borderColor: state.isFocused ? (state.isInvalid ? '#EF4444' : '#cccccc') : (state.isInvalid ? '#EF4444' : '#cccccc'),
        boxShadow: state.isFocused && !state.isInvalid ? '0 0 0 1px #cccccc' : 'none',
        '&:hover': {
            borderColor: state.isInvalid ? '#EF4444' : '#cccccc',
        },
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: '14px',
        color: '#6B7280',
    }),
    singleValue: (provided: any) => ({
        ...provided,
        fontSize: '14px',
        color: '#111827',
    }),
    input: (provided: any) => ({
        ...provided,
        fontSize: '14px',
    }),
};

export function FormAutoCompleteSignup({ name, singleListName, data, isDisabled, remark, label, ...otherProps }: any) {
    const { control, setValue, formState: { errors } }: any = useFormContext();

    const isInvalid = !!errors[name];

    return (
        <>
            <Controller
                control={control}
                name={name}
                render={({ field }) => {
                    return (
                        <div className="flex flex-col justify-between w-full mt-2">
                            {label &&
                                <div className="basis-2/4">
                                    <Label className="text-[#4B5563]">
                                        {label}
                                    </Label>
                                </div>
                            }

                            <div className={`${label && "basis-2/4"} relative w-full`}>
                                <Select
                                    {...field}
                                    {...otherProps}
                                    className={`${label && "mt-2"} ${isInvalid ? "border-red-500" : "border-[#cccccc]"} border-[1px] rounded-md`}
                                    isDisabled={isDisabled}
                                    options={data?.map((item: any) => ({
                                        value: item?.id?.toString(),
                                        label: item[`${singleListName}_name`],
                                    }))}
                                    isClearable
                                    value={
                                        field?.value
                                            ? data?.filter((option: any) =>
                                                field?.value?.value === option?.id?.toString() ||
                                                field?.value === option?.id?.toString()
                                            )?.map((item: any) => ({
                                                value: item?.id?.toString(),
                                                label: item[`${singleListName}_name`],
                                            }))[0]
                                            : null
                                    }
                                    onChange={(item: any) => {
                                        setValue(name, item?.value?.toString());
                                    }}
                                    styles={{
                                        ...customStyles,
                                        control: (provided: any) => customStyles.control(provided, { isFocused: field, isInvalid }),
                                    }}
                                />
                                {remark && (
                                    <span className="text-red-500 pl-1 absolute top-[50%] right-[-14px] transform -translate-y-1/2">*</span>
                                )}
                            </div>
                            {isInvalid && (
                                <p className="text-sm font-medium text-red-500 mt-2">
                                    {errors[name]?.message}
                                </p>
                            )}
                        </div>
                    );
                }}
            />
        </>
    );
}
