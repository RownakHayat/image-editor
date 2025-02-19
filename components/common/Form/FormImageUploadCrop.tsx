import { Dialog as DG, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useDeleteUserProfileImageMutation } from '@/store/features/UserManagement/User';
import { TrashIcon, UploadCloudIcon } from 'lucide-react';
import { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { useFormContext } from "react-hook-form";
import { getCroppedImg } from "./getCroppedImg";

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

const FormImageUploadCrop = (props: Props) => {
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
  const [imageDetails, setImageDetails] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null); // For cropping
  const [croppedImaged, setCroppedImaged] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImageDelete] = useDeleteUserProfileImageMutation()

  useEffect(() => {
    if (props.initialImage) {
      setCroppedImaged(props.initialImage); // Set the initial image for cropping
      setValue(props.name, props.initialImage); // Set the form value to the initial image
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

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
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
    if (!imageSrc) {
      console.error("No image source available");
      return;
    }

    const targetWidth = props.name === "profile_image_path" ? 300 : 80;
    const targetHeight = props.name === "profile_image_path" ? 300 : 80;

    const croppedImage = await getCroppedImg(imageSrc, croppedArea, targetWidth, targetHeight);
    setCroppedImaged(croppedImage);
    setValue(props.name, croppedImage);
    setIsModalOpen(false);
  };

  const handleDeleteImage = async () => {
    if (!croppedImaged || !props.userId) return;

    try {
      await profileImageDelete(props.userId);
      setCroppedImaged(null);
      setImageSrc(null);
      setValue(props.name, "");
    } catch (error) { }
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    onChangeFileUpload(files);
  };

  return (
    <div className="w-dw">
      <div className="my-3">
        {props.label && (
          <div className="">
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
              type='button'
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
        <Progress value={uploadProgress} className="w-[100%] h-2 " />
      )}

      <DG open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger className="m-0 p-0" />
        <DialogContent className="max-w-[400px] w-[90%] h-[auto] p-4 bg-[#e9e9ea] rounded-lg">
          <div className="relative w-full h-[300px]">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} // Set the desired aspect ratio
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                  },
                  mediaStyle: {
                    maxHeight: '350px',
                    maxWidth: '350px',
                  }
                }}
              />
            )}
          </div>
          <div className="flex justify-end p-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleSaveCroppedImage}
            >
              Save Cropped Image
            </button>
          </div>
        </DialogContent>
      </DG>
    </div>
  );
};

export default FormImageUploadCrop;
