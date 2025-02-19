import { UploadCloudIcon } from "lucide-react";
import Image from 'next/image';
import prettyBytes from "pretty-bytes";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface InputFieldProps {
    label?: string;
    placeholder?: string;
    type?: string;
    className?: string;
    style?: any;
    disabled?: boolean;
    remark?: boolean;
    accept?: string;
    existingFilePath?: string;
}

type Props = { name: string } & InputFieldProps;

const FormOnlyFileUpload = (props: Props) => {
    const {
        register,
        setValue,
        getValues,
        watch,
        setError,
        clearErrors,
        formState: { errors }
    } = useFormContext();

    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileDetails, setFileDetails] = useState<File | null>(null);
    const [fileType, setFileType] = useState<string>("");

    const fileToBase64 = (file: Blob): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject('Failed to convert file to base64');
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const onChangeFileUpload = async (files: FileList) => {
        const file = files[0];
        const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (!validTypes.includes(file.type)) {
            setError(props.name, {
                type: "manual",
                message: "Only PDF, DOC, and DOCX files are allowed."
            });
            return;
        } else if (file.size > 2200 * 1024) {
            setError(props.name, {
                type: "manual",
                message: "File size should be less than 2 MB."
            });
            return;
        } else {
            clearErrors(props.name);
        }

        setFileType(file.type);
        const base64File = await fileToBase64(file);
        setFileDetails(file);
        setValue(props.name, base64File);
    };

    const fileLayout: boolean =
        getValues(props.name) === undefined ||
        getValues(props.name)?.length === 0;

    const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        onChangeFileUpload(files);
    };

    const fileValue = watch(props.name);

    // Function to render the file image based on type
    const renderFileImage = (filePath: string) => {
        if (filePath.endsWith('.pdf')) {
            return <Image src="/assets/Image/pdf.png" alt="PDF Document" width={60} height={60} />;
        } else if (filePath.endsWith('.doc') || filePath.endsWith('.docx')) {
            return <Image src="/assets/Image/word.png" alt="Word Document" width={60} height={60} />;
        }
        return <p className="text-red-500">Unsupported file type</p>;
    };

    useEffect(() => {
        if (props.existingFilePath) {
            const file = new File([], props.existingFilePath);
            setFileDetails(file);
            setValue(props.name, props.existingFilePath);
            setFileType(file.type);
        }
    }, [props.existingFilePath]);

    useEffect(() => {
        if (!fileValue) {
            setFileDetails(null);
            setFileType("");
        }
    }, [fileValue]);

    return (
        <div className="w-dw">
            <div className="my-3">
                {props.label && (
                    <Label className="text-[#4B5563]">
                        {props.label}
                        {props?.remark && <span className="text-red-500 pl-1">*</span>}
                    </Label>
                )}
                <div className={`${props.label === undefined ? "basis-[100%]" : "basis-[75.4%]"} relative`}>
                    {fileLayout ? (
                        <label
                            htmlFor={props.name}
                            className="py-10 transition-all bg-gray-50 w-full border border-[#9EAFFE] block border-dashed text-black p-4 rounded-lg cursor-pointer"
                            onDrop={onDrop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className="w-full flex justify-center flex-col items-center space-y-1">
                                <UploadCloudIcon className="text-center" />
                                <p className="text-sm text-center">
                                    <strong className="text-blue-500 font-bold">
                                        Click to upload
                                    </strong>
                                    &nbsp; or drag and drop
                                </p>
                            </div>
                            <input
                                {...register(props.name, {
                                    onChange: (e) => onChangeFileUpload(e.target.files)
                                })}
                                type="file"
                                id={props.name}
                                name={props.name}
                                className="hidden w-full"
                                accept=".pdf, .doc, .docx"
                            />
                        </label>
                    ) : (
                        <div className="bg-gray-50 w-full object-contain border transition-all border-[#9EAFFE] block border-dashed text-black overflow-hidden rounded-lg cursor-pointer">
                            <div className="flex">
                                <div className="w-full h-[100px] flex items-center justify-center">
                                    {fileDetails && fileType ? (
                                        renderFileImage(fileDetails.name)
                                    ) : props.existingFilePath ? (
                                        renderFileImage(props.existingFilePath)
                                    ) : null}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col">
                                <div>
                                    <small>
                                        {fileDetails ? prettyBytes(fileDetails.size) : null}
                                    </small>
                                </div>
                                <div className="absolute top-1 right-1 bg-white p-1 rounded-lg">
                                    <Icons.delete
                                        onClick={() => {
                                            setValue(props.name, "");
                                            setFileDetails(null);
                                            setFileType("");
                                            clearErrors(props.name);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {errors[props.name]?.message && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors[props.name]?.message as string}
                    </p>
                )}
            </div>
            {uploadProgress !== 0 && (
                <Progress value={uploadProgress} className="w-[100%] h-2" />
            )}
        </div>
    );
};

export default FormOnlyFileUpload;
