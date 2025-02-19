import { Dialog as DG, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useDeleteUserSignImageMutation } from '@/store/features/UserManagement/User';
import { TrashIcon, UploadCloudIcon } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import ReactCrop, { Crop, PixelCrop, centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { canvasPreview } from '../ImageCrop/canvasPrevies';

interface InputFieldProps {
    label?: string;
    placeholder?: string;
    type?: string;
    className?: string;
    style?: any;
    disabled?: boolean;
    remark?: boolean;
    initialImage?: string;
    cropWidth?: number;
    cropHeight?: number;
    userId?: string;
}

type Props = {
    name: string;
} & InputFieldProps;

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight,
    );
}

const SignFormUpload = (props: Props) => {
    const {
        register,
        setValue,
        setError,
        clearErrors,
        formState: { errors }
    } = useFormContext();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageDetails, setImageDetails] = useState<any>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [croppedImaged, setCroppedImaged] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [signDelete] = useDeleteUserSignImageMutation();
    const [croppedArea, setCroppedArea] = useState<any>(null);

    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0);
    const [aspect, setAspect] = useState<number | undefined>(16 / 9)

    useEffect(() => {
        if (props.initialImage) {
            setCroppedImaged(props.initialImage);
            setValue(props.name, props.initialImage);
        }
    }, [props.initialImage, setValue, props.name]);

    const imageToBase64 = (file: Blob): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject('Failed to convert image to base64');
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const onChangeFileUpload = async (files: FileList) => {
        const file = files[0];
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (!validTypes.includes(file.type)) {
            setError(props.name, {
                type: "manual",
                message: "Only JPEG, JPG, and PNG files are allowed."
            });
            return;
        } else if (file.size > 2200 * 1024) {
            setError(props.name, {
                type: "manual",
                message: "File size should be less than 2 mb."
            });
            return;
        } else {
            clearErrors(props.name);
        }

        setImageDetails(file);
        const base64Img = await imageToBase64(file)
        setImageSrc(base64Img);
        setValue(props.name, base64Img);
        setIsModalOpen(true);
    };

    const handleSaveCroppedImage = async () => {
        if (!imageSrc || !completedCrop) {
            console.error("No image source or crop data available");
            return;
        }

        const croppedImage = await canvasPreview(imgRef.current!, completedCrop, rotate, scale);
        setCroppedImaged(croppedImage);
        setValue(props.name, croppedImage);
        setIsModalOpen(false);
    };

    const handleDeleteImage = async () => {
        if (!croppedImaged || !props.userId) return;

        try {
            await signDelete(props.userId);
            setCroppedImaged(null);
            setImageSrc(null);
            setValue(props.name, "");
        } catch (error) {
            console.error(error);
        }
    };

    const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        onChangeFileUpload(files);
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        if (aspect) {
            const { width, height } = e.currentTarget;
            const newCrop = centerAspectCrop(width, height, aspect);
            setCrop(newCrop);
            setCompletedCrop(convertToPixelCrop(newCrop, width, height));
        }
    };

    const handleCropComplete = (pixelCrop: PixelCrop) => {
        if (aspect) {
            setAspect(undefined)
        } else {
            setAspect(16 / 9)
            if (imgRef.current) {
                setCompletedCrop(pixelCrop);
            }
        }
    };

    return (
        <div className="w-dw">
            <div className="my-3">
                {props.label && (
                    <div>
                        <Label className="text-[#4B5563]">
                            {props.label}
                            {props?.remark && <span className="text-red-500 pl-1">*</span>}
                        </Label>
                    </div>
                )}

                {croppedImaged ? (
                    <div className="relative my-4 max-w-[200px] border border-spacing-2 p-2">
                        <img src={croppedImaged} alt="Cropped Image" className="rounded-lg w-full h-full max-w-[200px]" />
                        <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                            onClick={handleDeleteImage}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="relative">
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
                                accept="image/jpeg,image/jpg,image/png"
                            />
                        </label>
                    </div>
                )}

                {errors[props.name]?.message && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors[props.name]?.message as string}
                    </p>
                )}
            </div>

            {uploadProgress !== 0 && (
                <Progress value={uploadProgress} className="w-[100%] h-2" />
            )}

            <DG open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger className="m-0 p-0" />
                <DialogContent className="max-w-[400px] w-[95%] h-[auto] p-4 bg-[#e9e9ea] rounded-l">
                    <div className="relative w-full h-[500px]">
                        {!!imageSrc && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_: any, percentCrop: any) => setCrop(percentCrop)}
                                onComplete={(c: any) => handleCropComplete(convertToPixelCrop(c, imgRef.current!.width, imgRef.current!.height))}
                                aspect={aspect}
                                minHeight={100}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imageSrc}
                                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>

                        )}

                        <div className="flex justify-end p-4">
                            <button onClick={handleSaveCroppedImage} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Save Cropped Image
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </DG>
        </div>
    );
};

export default SignFormUpload;
