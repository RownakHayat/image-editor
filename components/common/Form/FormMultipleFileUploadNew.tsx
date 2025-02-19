import { Button } from "@/components/ui/button";
import { useDeleteImageMutation } from "@/store/features/UserManagement/User";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import "./style.multiUpload.css";

// Image interface
interface Image {
  id: string | number;
  url: string;
  file: File;
  name: string;
  base64: string;
}

interface Preview {
  type: string;
  previewUrl: string;
  fileUrl: string;
}

interface MultipleFileUploadNewProps {
  onImagesChange: (images: Image[]) => void;
  namelabel?: string;
  existingImages?: Image[];
  attachmentLabel?: string;
}

const MultipleFileUploadNew: React.FC<MultipleFileUploadNewProps> = ({
  onImagesChange,
  namelabel = "",
  existingImages = [],
  attachmentLabel = "",
}) => {
  const methods = useForm();
  const { handleSubmit, reset } = methods;
  const [images, setImages] = useState<Image[]>(existingImages);

  useEffect(() => {
    setImages(existingImages);
  }, [existingImages]);

  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<Preview[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    const formData = methods.getValues();
    const files: FileList = formData.images;
    const imageNames: string[] = formData.image_names
      .split(",")
      .map((name: string) => name.trim());

    const imagePromises = Array.from(files).map((file, i) => {
      return new Promise<Image>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve({
            id: Date.now() + i,
            url: URL.createObjectURL(file),
            file,
            name: imageNames[i] || `Image ${i + 1}`,  // Keeping the name even if same
            base64: base64String,
          });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises)
      .then((newImages) => {
        // Skip filtering duplicates by name or base64, so we allow duplicate names
        setImages((prevImages) => [...prevImages, ...newImages]);
        onImagesChange([...images, ...newImages]);

        setSelectedFileNames([]);
        setImagePreviews([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      })
      .catch((error) => console.error("Error uploading images:", error));
  };


  const [imageDelete] = useDeleteImageMutation();
  const handleDelete = async (url: string, imageId: number) => {
    if (url.startsWith("blob:")) {
      const updatedImages = images.filter((image) => image.url !== url);
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } else {
      try {
        const result = await imageDelete(imageId).unwrap();
        const updatedImages = images.filter((image) => image.id !== imageId);
        setImages(updatedImages);
        onImagesChange(updatedImages);
      } catch (error) { }
    }

    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((preview) => preview.fileUrl !== url)
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map((file) => file.name);
      setSelectedFileNames(fileNames);

      const previews: Preview[] = Array.from(files)
        .map((file) => {
          const fileType = file.type.toLowerCase();
          if (fileType === "application/pdf") {
            return {
              type: "pdf",
              previewUrl: "/assets/Image/pdf.png",
              fileUrl: URL.createObjectURL(file),
            };
          } else if (
            fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            file.name.endsWith(".docx")
          ) {
            return {
              type: "docx",
              previewUrl: "/assets/Image/word.png",
              fileUrl: URL.createObjectURL(file),
            };
          } else if (file.name.endsWith(".doc")) {
            return {
              type: "doc",
              previewUrl: "/assets/Image/word.png",
              fileUrl: URL.createObjectURL(file),
            };
          } else if (fileType.startsWith("image/")) {
            return {
              type: "image",
              previewUrl: URL.createObjectURL(file),
              fileUrl: URL.createObjectURL(file),
            };
          }
          return null;
        })
        .filter(Boolean) as Preview[];

      setImagePreviews(previews);
    }
  };

  useEffect(() => {
    reset({ image_names: "" });
  }, [images, reset]);

  return (
    <FormProvider {...methods}>
      <div>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-6">
            <p className="text-sm mb-2 text-gray-500 tracking-wide">
              {namelabel}
            </p>
            <input
              type="text"
              {...methods.register("image_names")}
              placeholder="Attachment Name"
              className="flex h-10 w-full focus-visible:outline-[#30329E] text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 m-0 p-0 bg-white border-[1px] rounded-md border-[#cccccc] outline-none px-2"
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <p className="text-sm mb-2 text-gray-500 tracking-wide">
              {attachmentLabel}
            </p>
            <div className="flex items-center justify-center">
              <label className="rounded-lg border-2 w-full h-10 text-center flex items-center justify-center cursor-pointer">
                <p className="pointer-none text-gray-500"> + Attachment</p>
                <input
                  type="file"
                  {...methods.register("images", {
                    onChange: (e) => handleFileChange(e),
                  })}
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden w-full"
                />
              </label>
            </div>
            <div className="text-right py-4">
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="w-32 h-32 border rounded">

                      {/* PDF Preview */}
                      {preview.type === "pdf" && (
                        <a
                          href={preview.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-full flex items-center justify-center"
                        >
                          <Image
                            src={preview.previewUrl}
                            alt={`PDF Preview ${index}`}
                            width={50}
                            height={50}
                            className="object-contain"
                          />
                        </a>
                      )}

                      {/* DOC & DOCX Preview - Fix Condition */}
                      {(preview.type === "docx" || preview.type === "doc") && (
                        <a
                          href={preview.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-full flex items-center justify-center"
                        >
                          <Image
                            src={preview.previewUrl}
                            alt={`DOC Preview ${index}`}
                            width={50}
                            height={50}
                            className="object-contain"
                          />
                        </a>
                      )}

                      {/* Image Preview */}
                      {preview.type === "image" && (
                        <img
                          src={preview.previewUrl}
                          alt={`Image Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                      )}
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
                        <a href={image.url} target="_blank" rel="noopener noreferrer">
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

export default MultipleFileUploadNew;
