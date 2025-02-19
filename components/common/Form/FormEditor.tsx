import { FC, useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import {
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

interface InputFieldProps {
    label?: string
    placeholder?: string
    type?: string,
    className?: string,
    style?: any,
    disabled?: boolean,
    remark?: true | false
    min?: any
    rows?: any
    cols?: any
    value?: any
}

type FormInputProps = {
    name: string,
} & InputFieldProps

const FormEditor: FC<FormInputProps> = ({ name, ...otherProps }) => {
    const { control, setValue } = useFormContext()
    const editorRef = useRef<any>(null);
    const config = {
        buttons: ["bold", "italic", "underline", "strikethrough", "|", "ul", "ol", "|", "center", "left", "right", "justify", "|", "link", "table", "redo-undo", "resizer", "link", "paste", "fullsize"],
        uploader: { insertImageAsBase64URI: true },
        removeButtons: ["brush", "file"],
        showXPathInStatusbar: false,
        showCharsCounter: false,
        showWordsCounter: false,
        toolbarAdaptive: false,
        askBeforePasteFromWord: false,
        askBeforePasteHTML: false,
    };

    const handlePaste = useCallback((event: ClipboardEvent) => {
        if (!confirm("Are you sure you want to paste?")) {
            event.preventDefault();
        }
    }, []);

    useEffect(() => {
        editorRef.current?.editor?.addEventListener('paste', handlePaste);

        return () => {
            editorRef.current?.editor?.removeEventListener('paste', handlePaste);
        };
    }, [handlePaste]);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full">
                    {otherProps.label &&
                        <div className="flex justify-between items-center basis-2/4">
                            <Label className="text-[#4B5563]">{otherProps.label}<span className="text-red-500 pl-1" >{otherProps?.remark && '*'} </span></Label>

                        </div>
                    }
                    <div className={`${otherProps.label && "basis-2/4"} relative`}>
                        <FormControl className="m-0 p-0" >
                            <JoditEditor
                                ref={editorRef}
                                value={field?.value}
                                onBlur={(text: any) => setValue(field.name, text)}
                                {...otherProps}
                                config={{
                                    readonly: otherProps?.disabled,
                                    ...config,
                                }}
                            />
                        </FormControl>
                        <FormMessage className="absolute -bottom-6" />
                    </div>
                </FormItem>
            )}
        />
    )
}

export default FormEditor