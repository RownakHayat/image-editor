import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  onProfileEdit?: (data: {
    file: File | null;
    documentId: string;
    base64String?: string;
  }) => void;
  documentId: string;
  label?: string;
  remark?: boolean;
};
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes



const FormFileUploadProfile = ({
  name,
  onProfileEdit,
  documentId,
  label,
  remark,
}: Props) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  // const [imageDetails, setImageDetails] = useState<File[]>([]);

  const [fileDetails, setFileDetails] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the 3MB limit. Please upload a smaller file.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Unsupported file type. Only PDF and DOC files are allowed.");
      return;
    }



    setFileDetails([file]);

    // setImageDetails(acceptedFiles);
    // const file = acceptedFiles[0];

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      setValue(name, base64String);
      onProfileEdit?.({ file, documentId, base64String });
    };

    reader.readAsDataURL(file); // Start the file reading process
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": []
    },
  });



  const handleDelete = (id: string): void => {
    setFileDetails([]);
    setValue(name, null);
    onProfileEdit?.({ file: null, documentId: id });
  };

  const imageUrl = watch(name);
  // const isImage = imageDetails[0]?.type.startsWith("image/") || imageUrl?.includes("data:image");

  const fileUrl = watch(name);
  const isBase64Pdf = fileUrl?.startsWith("data:application/pdf");
  const isBase64Image = fileUrl?.startsWith("data:image/");

  const isDoc = fileDetails[0]?.type === "application/msword" || fileDetails[0]?.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isPdf = fileDetails[0]?.type.startsWith("data:application/pdf");
  const isImage = fileDetails[0]?.type.startsWith("data:image/");

  return (
    <div className="w-full">
      {label && (
        <Label className="text-[#4B5563] my-2">
          {label}
          {remark && <span className="text-red-500 pl-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {/* {!fileDetails.length && !fileUrl ? ( */}
        {!fileDetails.length && !watch(name) ? (
          <div
            {...getRootProps()}
            className="transition-all bg-gray-50 w-full border border-[#9EAFFE] block border-dashed text-black p-2 rounded-lg cursor-pointer"
          >
            <input {...getInputProps()} />
            <p className="text-sm text-center">+ Attachment(PDF, DOC, DOCX)</p>
          </div>
        ) : (
          <div className="flex gap-6">
          {/* <pre>{JSON.stringify(isImage, null, 2)}</pre> */}
          {isImage ? (
            <Image
              src={fileUrl}
              alt="Image"
              width={60}
              height={60}
              className="w-20 h-20 object-contain"
            />
          ) : isPdf ? (
            <Image
              priority={true}
              src="/assets/Image/pdf.png"
              alt="Logo"
              width="128"
              height="128"
              className="pdfIcon"
            />
          ) : isDoc ? (
            <Image
              priority={true}
              src="/assets/Image/word.png"
              alt="DOC Icon"
              width="128"
              height="128"
              className="docIcon"
            />
          ) : null}
          <div className="flex-1 flex flex-col justify-between">
            <div
              {...getRootProps()}
              className="transition-all bg-gray-50 w-full border border-[#9EAFFE] block border-dashed text-black p-2 rounded-lg cursor-pointer"
            >
              <input {...getInputProps()} />
              <p className="text-sm text-center">+ Attachment(PDF, DOC, DOCX)</p>
            </div>

            {fileDetails.length > 0 && (
              <button
                type="button"
                onClick={() => handleDelete(documentId)}
                className="cursor-pointer"
              >
                <Trash2 />
              </button>
            )}
          </div>
        </div>
        )}

        {errors?.[name]?.message && (
          <p className="text-sm font-medium text-destructive absolute">
            {typeof errors[name]?.message === "string"
              ? (errors[name]?.message as string)
              : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormFileUploadProfile;
