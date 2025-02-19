import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { siteConfig } from "@/config/site";
import { FileCode2 } from "lucide-react";
import Image from "next/image";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";





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

const FormFileUploadWithoutLabel = (props: Props) => {
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

  const imageToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
              if (prevProgress < 100) {
                return prevProgress + 1
              } else {
                clearInterval(interval)
                setUploadProgress(0)
                return prevProgress
              }
            })
          }, 10)
        }
      }
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const onChangeFileUpload = async (e: any) => {
    // Initialize arrays to store image types and base64 strings
    const imageTypes: any[] = [];
    const base64Images: any[] = [];

    // Loop through each file in the event array
    for (let i = 0; i < e.length; i++) {
      const file = e[i];

      // Get the type of the file
      const type = file.type;

      // Convert the file to base64 string
      const base64Img = await imageToBase64(file);

      // Add the image type and base64 string to the arrays
      imageTypes.push(type);
      base64Images.push(base64Img);
    }

    // Set the state variables accordingly
    setImageType(imageTypes);
    setImageDetails(e);

    // Set the form value to an array of base64 strings
    setValue(props.name, base64Images);
  }


  const imageLayout: Boolean =
    getValues(props.name) === undefined || getValues(props.name)?.length === 0
      ? true
      : false

  const onDrop = (e: any) => {
    onChangeFileUpload(e)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <div className="w-full" >
      <div  >
        {props.label && <div className="flex justify-between items-start basis-[24.6%]">
          <Label className="text-[#4B5563] my-2">{props.label}<span className="text-red-500 pl-1" >{props?.remark && '*'} </span></Label>
        </div>}
        <div
          {...register(props.name, {
            onChange: onChangeFileUpload,
          })}
          className={`${props.label === undefined ? 'basis-[100%]' : 'basis-[75.4%]'} relative`}>
          {imageLayout === true ? (
            <label
              htmlFor="upload"
              className=" transition-all bg-gray-50 w-full border border-[#9EAFFE] block border-dashed text-black p-2 rounded-lg cursor-pointer"

            >
              <div className="w-full flex justify-center flex-col items-center space-y-1">
                <p className="text-sm text-center">
                  + Attachment
                </p>
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
            <div className="bg-gray-50 w-full border transition-all border-[#9EAFFE] block border-dashed text-black  overflow-hidden p-4 rounded-lg cursor-pointer">
              <div className="flex gap-6">
                <div className="w-full h-20">
                  {imageType?.includes("image") ||
                    (typeof watch(props.name) !== "object" &&
                      watch(props?.name)?.includes("image")) ? (
                    <div className="w-20 h-20">
                      <Image
                        src={typeof watch(props.name) !== "object" && watch(props?.name)?.includes("base64") ? watch(props?.name) : `${siteConfig.envConfig[`${process.env.APP_ENV}`]?.IMAGE_URL}${watch(props?.name)}`}
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
                    <div className="flex justify-between w-full">
                      <FileCode2 className="w-20 h-full" />
                      {!imageDetails && <div>
                        <Icons.delete
                          onClick={() => {
                            setValue(props.name, ""); // Update the form value
                          }}
                        />
                      </div>}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center flex-1">
                    <div>                    
                      {imageDetails && imageDetails.map((image: any, index: number) => (
                        <div key={index} className="mt-4 flex justify-between gap-5">
                          <div >
                            <p>{image?.name}</p>
                            <small>{image && prettyBytes(image?.size)}</small>
                          </div>
                          <div>
                            <Icons.delete
                              onClick={() => {
                                const updatedImageDetails = [...imageDetails];
                                updatedImageDetails.splice(index, 1); // Remove the image at the specified index
                                setImageDetails(updatedImageDetails); // Update the imageDetails state
                                setValue(props.name, updatedImageDetails); // Update the form value
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                  <div>
                    {uploadProgress !== 0 && (
                      <Progress value={uploadProgress} className="w-[100%] h-2 " />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(!getValues(`${props.name}`) || errors?.[props.name]?.message) ? (
            <p className="text-sm font-medium text-destructive absolute">
              {errors?.[props.name]?.message || ""}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  )
}

export default FormFileUploadWithoutLabel
