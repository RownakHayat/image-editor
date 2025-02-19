import { Button } from "@/components/ui/button";
import { useDeleteImageMutation } from "@/store/features/UserManagement/User";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import "./style.multiUpload.css";

interface Image {
  id?: string | number;
  url: string;
  file: File;
  name: string;
  base64: string;
}

interface MultipleFileUploadNewEventProps {
  onImagesChange: (images: Image[]) => void;
  namelabel?: string;
  attachmentLabel?: string;
  existingImages?: Image[];
}

const MultipleFileUploadUpdated: React.FC<MultipleFileUploadNewEventProps> = ({
  onImagesChange,
  namelabel = "",
  attachmentLabel = "",
  existingImages = [],
}) => {
  const methods = useForm();
  const { reset } = methods;

  const [images, setImages] = useState<Image[]>(existingImages);
  const [filePreviews, setFilePreviews] = useState<
    { preview: string; type: string; fileUrl: string }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setImages(existingImages);
  }, [existingImages]);

  const handleUpload = () => {
    const formData = methods.getValues();
    const files: FileList = formData.images;

    if (!files || files.length === 0) return;

    const imageNames: string[] = formData.image_names
      ? formData.image_names.split(",").map((name: string) => name.trim())
      : [];

    const filePromises = Array.from(files).map((file, i) => {
      return new Promise<Image>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve({
            id: Date.now() + i,
            url: URL.createObjectURL(file),
            file,
            name: imageNames[i] || `File ${i + 1}`,
            base64: base64String,
          });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises)
      .then((newFiles) => {
        setImages((prevImages) => [...prevImages, ...newFiles]);
        onImagesChange([...images, ...newFiles]);

        setFilePreviews([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        reset({ image_names: "" });
      })
      .catch((error) => console.error("Error uploading files:", error));
  };

  const [fileDelete] = useDeleteImageMutation();
  const handleDelete = async (url: string, fileId: number) => {
    if (url.startsWith("blob:")) {
      const updatedImages = images.filter((image) => image.url !== url);
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } else {
      try {
        await fileDelete(fileId).unwrap();
        const updatedImages = images.filter((image) => image.id !== fileId);
        setImages(updatedImages);
        onImagesChange(updatedImages);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    setFilePreviews((prevPreviews) =>
      prevPreviews.filter((preview) => preview.fileUrl !== url)
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previews = Array.from(files).map((file) => {
        if (file.type === "application/pdf") {
          return {
            preview: "/assets/Image/pdf.png", // Use a PDF icon
            type: "pdf",
            fileUrl: URL.createObjectURL(file),
          };
        } else if (
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/msword"
        ) {
          return {
            preview: "/assets/Image/word.png", // Use a Word document icon
            type: "doc",
            fileUrl: URL.createObjectURL(file),
          };
        } else if (file.type.startsWith("image/")) {
          return {
            preview: URL.createObjectURL(file), // Image preview
            type: "image",
            fileUrl: URL.createObjectURL(file),
          };
        }
        return null;
      }).filter(Boolean);

      setFilePreviews(previews as { preview: string; type: string; fileUrl: string }[]);
    }
  };

  return (
    <FormProvider {...methods}>
      <div>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-6">
            <p className="text-sm mb-2 text-gray-500 tracking-wide">{namelabel}</p>
            <input
              type="text"
              {...methods.register("image_names")}
              placeholder="Attachment Name"
              className="flex h-10 w-full focus-visible:outline-[#30329E] text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 m-0 p-0 bg-white border-[1px] rounded-md border-[#cccccc] outline-none px-2"
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <p className="text-sm mb-2 text-gray-500 tracking-wide">{attachmentLabel}</p>
            <div className="flex items-center justify-center">
              <label className="rounded-lg border-2 w-full h-10 text-center flex items-center justify-center cursor-pointer">
                <p className="pointer-none text-gray-500"> + Attachment</p>
                <input
                  type="file"
                  {...methods.register("images", {
                    onChange: (e) => {
                      handleFileChange(e);
                    },
                  })}
                  multiple
                  accept="image/*, .pdf, .doc, .docx"
                  className="hidden w-full"
                />
              </label>
            </div>
            <div className="text-right py-4">
              {filePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {filePreviews.map((file, index) => (
                    <div key={index} className="w-32 h-32 border rounded relative">
                      {file.type === "pdf" && (
                        <img
                          src={file.preview}
                          alt={`PDF Preview ${index}`}
                          className="w-full h-full object-contain"
                        />
                      )}
                      {file.type === "doc" && (
                        <img
                          src={file.preview}
                          alt={`DOC Preview ${index}`}
                          className="w-full h-full object-contain"
                        />
                      )}
                      {file.type === "image" && (
                        <img
                          src={file.preview}
                          alt={`Image Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <Button
                        variant="outline"
                        className="absolute top-0 right-0 rounded-full p-1"
                        onClick={() => handleDelete(file.fileUrl, images[index]?.id as number)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                onClick={handleUpload}
                className="bg-green-600 hover:bg-green-600"
              >
                <Plus /> Upload
              </Button>
            </div>
          </div>
        </div>

        {images.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <table>
              <thead>
                <tr>
                  <th className="text-left">File Name</th>
                  <th className="text-center">Attachment</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {images.map((image: any, index) => (
                  <tr key={index} className="relative">
                    <td className="text-left">{image.name}</td>
                    <td>
                      {image?.file?.type?.startsWith("image/") ||
                        image?.url?.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                        <img
                          src={image.url}
                          alt={`Uploaded ${index}`}
                          className="uploadImage"
                        />
                      ) : image?.file?.type === "application/pdf" ||
                        image?.base64?.endsWith(".pdf") ||
                        image?.url?.endsWith(".pdf") ? (
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Image
                            priority={true}
                            src="/assets/Image/pdf.png"
                            alt={`PDF Attachment for ${image.name}`}
                            width="100"
                            height="100"
                            className="pdfIcon"
                          />
                        </a>
                      ) : image?.file?.type === "application/msword" ||
                        image?.file?.type ===
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                        image?.base64?.endsWith(".doc") ||
                        image?.base64?.endsWith(".docx") ||
                        image?.url?.endsWith(".doc") ||
                        image?.url?.endsWith(".docx") ? (
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="items-center flex justify-center"
                        >
                          <Image
                            priority={true}
                            src="/assets/Image/wordd.png"
                            alt={`Document Attachment for ${image.name}`}
                            width="100"
                            height="100"
                            className="wordIcon"
                          />
                        </a>
                      ) : (
                        <span className="text-blue-500">Download</span>
                      )}
                    </td>


                    <td className="action">
                      <button
                        type="button"
                        onClick={() => handleDelete(image.url, image.id)}
                        className="removeIcon"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default MultipleFileUploadUpdated;
