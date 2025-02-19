import { FileCode2 } from "lucide-react";
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

const FormImageUploadWithShortText = (props: Props) => {
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

  const error = errors[props.name] && (errors[props.name] as any)?.message;

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
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject("Failed to convert file to base64");
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
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!validTypes.includes(file.type)) {
      setError(props.name, {
        type: "manual",
        message: "Only JPG, PNG, PDF, DOC, DOCX, and XLS files are allowed."
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

  const renderFileIcon = (imageType: string) => {
    if (imageType.includes("image"))
      return (
        <Image
          src={watch(props.name)}
          width={100}
          height={100}
          alt="Preview"
          style={{
            width: "100%",
            height: "80px",
            objectFit: "contain",
            maxWidth: "150px",
          }}
        />
      );
    if (imageType === "application/pdf")
      return (
        <Image
          priority={true}
          src="/assets/Image/pdf.png"
          alt="PDF Icon"
          width="150"
          height="150"
          className="pdfIcon"
        />
      );
    if (imageType.includes("word"))
      return (
        <Image
          priority={true}
          src="/assets/Image/word.png"
          alt="DOC Icon"
          width="128"
          height="128"
          className="docIcon"
        />
      );
    if (imageType.includes("excel"))
      return (
        <Image
          priority={true}
          src="/assets/Image/excel.png"
          alt="Excel Icon"
          width="128"
          height="128"
          className="excelIcon"
        />
      );
    return <FileCode2 />;
  };

  return (
    <div className="m-0 ">
      <div className="my-3 ">
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
              className=" transition-all bg-gray-50 w-full border border-[#9EAFFE] block border-dashed text-black px-4 py-[9px] rounded-lg cursor-pointer"
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="w-full flex justify-center flex-col items-center space-y-1 ">
                <p className="text-sm text-center mx-5 text-nowrap">
                  + Attachment
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
                accept="image/jpeg,image/jpg,image/png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
            </label>
          ) : (
            <div className="bg-gray-50 w-full border transition-all border-[#9EAFFE] block border-dashed text-black overflow-hidden rounded-lg cursor-pointer">
              <div className="flex">
                <div className="w-full h-full">
                  {imageType?.includes("image") ||
                    (typeof watch(props.name) !== "object" &&
                      watch(props.name)?.includes("image")) ? (
                    <Image
                      src={watch(props.name)}
                      className="w-full h-full"
                      width={100}
                      height={100}
                      alt=""
                      style={{
                        width: "100%",
                        height: "80px",
                        objectFit: "contain",
                        maxWidth: "150px"
                      }}
                    />
                  ) : (
                    <>{renderFileIcon(imageType)}</>
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
        {error && (
          <p className="text-red-500 text-sm mt-2">
            {error.toString()}
          </p>
        )}
      </div>
      {uploadProgress !== 0 && (
        <Progress value={uploadProgress} className="w-[100%] h-2 " />
      )}
    </div>
  );
};

export default FormImageUploadWithShortText;
