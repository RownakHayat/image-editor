import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { useDropzone } from "react-dropzone";

interface InputFieldProps {
    label?: string;
    placeholder?: string;
    type?: string;
    className?: string;
    style?: any;
    disabled?: boolean;
    remark?: boolean;
}

type Props = {
    name: any;
} & InputFieldProps;

const FormChatFileUpload = ({ name, label, remark, ...props }: Props) => {
    const {
        register,
        setValue,
        getValues,
        watch,
        formState: { errors },
    }: any = useFormContext();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageDetails, setImageDetails] = useState<any>(null);
    const [imageType, setImageType] = useState<any>("");
    const [base64Values, setBase64Values] = useState<any>([])

    const imageToBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onprogress = (event) => {
                if (event.lengthComputable) {
                    let interval = setInterval(() => {
                        setUploadProgress((prevProgress) => {
                            if (prevProgress < 100) {
                                return prevProgress + 1;
                            } else {
                                clearInterval(interval);
                                setUploadProgress(0);
                                return prevProgress;
                            }
                        });
                    }, 10);
                }
            };
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const onChangeFileUpload = async (e: any) => {
        const imageTypes: any[] = [];
        const base64Images: any[] = [];
        const load64Images: any[] = [];
        for (let i = 0; i < e.length; i++) {
            const file = e[i];
            const type = file.type;
            const base64Img = await imageToBase64(file);
            imageTypes.push(type);
            load64Images.push({ ...file, imagepath: base64Img });
            base64Images.push(base64Img);
        }
        setImageType(imageTypes);
        setImageDetails(e);
        setValue(name, base64Images);
        setBase64Values(load64Images);
    };

    const imageLayout =
        getValues(name) === undefined || getValues(name)?.length === 0;

    const onDrop = (e: any) => {
        onChangeFileUpload(e);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
    });

    return (
        <div className="w-full relative">
            <div>
                {label && (
                    <div className="flex justify-between items-start">
                        <Label className="text-[#4B5563]">
                            {label}
                            {remark && <span className="text-red-500 pl-1">*</span>}
                        </Label>
                    </div>
                )}
                <div
                    {...register(name, {
                        onChange: onChangeFileUpload,
                    })}
                    className={`${label === undefined ? "basis-[100%]" : "basis-[75.4%]"
                        } relative`}
                >
                    {imageLayout === true ? (
                        <label
                            htmlFor="upload"
                            className="transition-all w-full border block border-dashed text-black rounded-lg cursor-pointer"
                        >
                            <div className="w-full flex justify-center flex-col items-center">
                                <Icons.attachment className="text-center text-textColor" />
                            </div>
                            <input
                                type="file"
                                id="upload"
                                className="hidden w-full"
                                multiple
                                {...getInputProps()}
                            />
                        </label>
                    ) : (
                        <div className="absolute bottom-10 custom-scrollbar overflow-y-scroll border-red-500 w-[400px] bg-gray-50 border transition-all border-dashed text-black overflow-hidden p-4 rounded-lg cursor-pointer">
                            <div className="gap-6">
                                {base64Values?.length > 0 && base64Values?.map((img: any, idx: number) => {
                                    return (
                                        <div className="w-full" key={idx}>
                                            {imageType?.includes("image") ||
                                                (typeof watch(name) !== "object" &&
                                                    watch(name)?.includes("image")) ? (
                                                <div className="w-20">
                                                    <Image
                                                        src={
                                                            typeof img?.imagepath === "string" &&
                                                                img?.imagepath.includes("base64")
                                                                ? img?.imagepath
                                                                : `${siteConfig.envConfig[
                                                                    `${process.env.APP_ENV}`
                                                                ]?.IMAGE_URL
                                                                }${name}`
                                                        }
                                                        className="w-full h-full"
                                                        width={60}
                                                        height={60}
                                                        alt="Image"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "contain",
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex justify-between my-3">
                                                    <div>
                                                        <Image
                                                            src={
                                                                typeof img?.imagepath === "string" &&
                                                                    img?.imagepath.includes("base64")
                                                                    ? img?.imagepath
                                                                    : `${siteConfig.envConfig[
                                                                        `${process.env.APP_ENV}`
                                                                    ]?.IMAGE_URL
                                                                    }${name}`
                                                            }
                                                            width={200}
                                                            height={100}
                                                            alt="Image"
                                                        />
                                                        <div>
                                                            <p className="">
                                                                {img?.path?.slice(0, 20)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Icons.delete
                                                            onClick={() => {
                                                                const updatedImageDetails = [...imageDetails];
                                                                const updateBase64 = [...base64Values];
                                                                updatedImageDetails.splice(
                                                                    idx,
                                                                    1
                                                                );
                                                                updateBase64.splice(
                                                                    idx,
                                                                    1
                                                                );
                                                                setImageDetails(
                                                                    updatedImageDetails
                                                                );
                                                                setBase64Values(
                                                                    updateBase64
                                                                );
                                                                setValue(
                                                                    name,
                                                                    updatedImageDetails
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                {/* <div className="">
                                    <div className="">
                                        <div>
                                            {imageDetails &&
                                                imageDetails.map(
                                                    (image: any, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="mt-4 justify-between gap-5 flex"
                                                        >
                                                            <div>
                                                                <p className="text-nowrap">
                                                                    {image?.name?.slice(0, 20)}
                                                                </p>
                                                                <small>
                                                                    {image && prettyBytes(image?.size)}
                                                                </small>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                    <div>
                                        {uploadProgress !== 0 && (
                                            <Progress
                                                value={uploadProgress}
                                                className="w-[100%] h-2"
                                            />
                                        )}
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FormChatFileUpload;
