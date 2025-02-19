import { FileCode2, UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
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
}

type Props = {
  name: string; // Update to specify that name is always a string
} & InputFieldProps;

const FormUserImageAttachment = (props: Props) => {
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
  const [imageType, setImageType] = useState<any>("");

  // const imageToBase64 = (file: any) => {
  //   return new Promise((resolve, reject) => {
  //     if (!file || !(file instanceof Blob)) {
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onprogress = (event) => {
  //       if (event.lengthComputable) {
  //         const interval = setInterval(() => {
  //           setUploadProgress((prevProgress) => {
  //             if (prevProgress < 100) {
  //               return prevProgress + 1;
  //             } else {
  //               clearInterval(interval);
  //               setUploadProgress(0);
  //               return prevProgress;
  //             }
  //           });
  //         }, 10);
  //       }
  //     };
  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };
  //     reader.onerror = (error) => {
  //       reject(error);
  //     };
  //   });
  // };



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

    setImageType(file.type);
    let base64Img = await imageToBase64(file);
    setImageDetails(file);
    setValue(props.name, base64Img);
  };

  const imageLayout: boolean =
    getValues(props.name) === undefined ||
      getValues(props.name)?.length === 0
      ? true
      : false;

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
        <div
          className={`${props.label === undefined ? "basis-[100%]" : "basis-[75.4%]"
            } relative`}
        >
          {imageLayout ? (
            <label
              htmlFor={props.name} // Use props.name as htmlFor and id
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
                id={props.name} // Use props.name as htmlFor and id
                name={props.name} // Bind name prop to input's name attribute
                className="hidden w-full"
                accept="image/jpeg,image/jpg,image/png"
              />
            </label>
          ) : (
            <div className="bg-gray-50 w-full   object-contain border transition-all border-[#9EAFFE] block border-dashed text-black overflow-hidden rounded-lg cursor-pointer">
              <div className="flex">
                <div className="w-full h-[100px]">
                  {imageType?.includes("image") ||
                    (typeof watch(props.name) !== "object" &&
                      watch(props.name)?.includes("image")) ? (
                    <Image
                      src={watch(props.name)}
                      className="w-full h-[200px]"
                      width={100}
                      height={100}
                      alt="Image"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        maxWidth: "100%"
                      }}
                    />
                  ) : (
                    <FileCode2 className="" />
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                {/* <div className="flex justify-between items-center flex-1"> */}
                <div >
                  <div>
                    {/* <p className="w-[100px]">{imageDetails?.name}</p> */}
                    <small>
                      {imageDetails && prettyBytes(imageDetails?.size)}
                    </small>
                  </div>
                  <div className="absolute top-1 right-1 bg-white p-1 rounded-lg">
                    <Icons.delete
                      onClick={() => {
                        setValue(props.name, "");
                        setImageDetails("");
                      }}
                    />
                  </div>
                </div>
                <div></div>
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
        <Progress value={uploadProgress} className="w-[100%] h-2 " />
      )}
    </div>
  );
};

export default FormUserImageAttachment;
