import { FileCode2, UploadCloudIcon } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Icons } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { siteConfig } from "@/config/site";
import { useDropzone } from "react-dropzone";

interface InputFieldProps {
  label?: string
  placeholder?: string
  type?: string,
  className?: string,
  style?: any,
  disabled?: boolean,
  remark?: true | false
}

type Props = {
  name: any
} & InputFieldProps

const FormFileUploadUpdated = (props: Props) => {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  }: any = useFormContext()

  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageDetails, setImageDetails] = useState<any>(null)
  const [imageType, setImageType] = useState<any>("")

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
    setImageType(e[0]?.type || "")
    let base64Img = await imageToBase64(e[0])
    setImageDetails(e[0])
    setValue(props.name, base64Img)
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
      <div className="" >
        {props.label && <div className="flex justify-between items-start basis-[24.6%]">
          <Label className="text-[#4B5563]">{props.label}<span className="text-red-500 pl-1" >{props?.remark && '*'} </span></Label>
         
        </div>}
        <div
          {...register(props.name, {
            onChange: onChangeFileUpload,
          })}
          className={`${props.label === undefined ? 'basis-[100%]' : 'basis-[100%]'} relative pt-4`}>
          {imageLayout === true ? (
            <label
              htmlFor="upload"
              className="py-10 transition-all bg-gray-50 w-full border border-[#9EAFFE] block border-dashed text-black p-4 rounded-lg cursor-pointer"

            >
              <div className="w-full flex justify-center flex-col items-center space-y-1">
                <UploadCloudIcon className="text-center" />
                <p className="text-sm text-center">
                  <strong className="text-blue-500 font-bold">
                    Click to upload
                  </strong>
                  &nbsp;  or drag and drop  <br /> JPG,JPEG,PNG or PDF
                </p>
              </div>
              <input
                type="file"
                id="upload"
                className="hidden w-full"
                {...getInputProps()}
              />
            </label>
          ) : (
            <div className="bg-gray-50 w-full border transition-all border-[#9EAFFE] block border-dashed text-black  overflow-hidden p-4 rounded-lg cursor-pointer">
              <div className="flex gap-6">
                <div className="w-20 h-20">
                  {imageType?.includes("image") ||
                    (typeof watch(props.name) !== "object" &&
                      watch(props?.name)?.includes("image")) ? (
                    <img
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
                  ) : (
                    <FileCode2 className="w-full h-full" />
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center flex-1">
                    <div>
                      <p>{imageDetails?.name}</p>
                      <small>
                        {imageDetails && prettyBytes(imageDetails?.size)}
                      </small>
                    </div>
                    <div>
                      <Icons.delete
                        onClick={() => {
                          setValue(props.name, "")
                          setImageDetails("")
                        }}
                      />
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

export default FormFileUploadUpdated