import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";
import { useDeleteImageMutation } from "@/store/features/UserManagement/User";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import "./style.multiUpload.css";

interface Image {
  id?: string | number;
  url: string;
  file: File;
  name: string;
  base64: string;
  priority: number;
}

interface MultipleFileUploadNewEventProps {
  onImagesChange: (images: Image[]) => void;
  namelabel?: string;
  prioritylabel?: string;
  existingImages?: Image[];
  attachmentLabel?: string;
}

const MultipleFileUploadNewEvent: React.FC<MultipleFileUploadNewEventProps> = ({
  onImagesChange,
  namelabel = "",
  prioritylabel = "",
  existingImages = [],
  attachmentLabel = "",
}) => {
  const methods = useForm();
  const { handleSubmit, reset } = methods;
  // const [images, setImages] = useState<Image[]>([]);
  const [images, setImages] = useState<Image[]>(existingImages);

  useEffect(() => {
    setImages(existingImages);
  }, [existingImages]);

  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  // const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<
    { preview: string; type: string }[]
  >([]);

  // Use ref to reset the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    const formData = methods.getValues();
    const files: FileList = formData.images;

    const imageNames: string[] = formData.image_names
      .split(",")
      .map((name: string) => name.trim());

    const priorityValue = parseInt(formData.image_priority, 10);

    if (priorityValue < 0) {
      alert(
        "Priority cannot be negative. Please enter a value of 0 or higher."
      );
      return; // Stop upload process
    }

    const isDuplicatePriority = images.some(
      (image) => image.priority === priorityValue
    );

    if (isDuplicatePriority) {
      alert(
        "Priority number is already used. Please choose a different priority."
      );
      return;
    }

    const imagePromises = Array.from(files).map((file, i) => {
      return new Promise<Image>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve({
            id: Date.now() + i,
            url: URL.createObjectURL(file),
            file,
            name: imageNames[i] || `Image ${i + 1}`,
            base64: base64String,
            priority: priorityValue,
          });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises)
      .then((newImages) => {
        const uniqueImages = newImages.filter(
          (newImage) =>
            !images.some(
              (existingImage) =>
                existingImage.name === newImage.name ||
                existingImage.base64 === newImage.base64
            )
        );

        setImages((prevImages) => [...prevImages, ...uniqueImages]);
        onImagesChange([...images, ...uniqueImages]);

        setSelectedFileNames([]);
        setImagePreviews([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        reset({ image_priority: "" });
      })
      .catch((error) => console.error("Error uploading images:", error));
  };

  const handlePriorityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedPriority = Math.max(parseInt(e.target.value, 10), 0);
    if (isNaN(updatedPriority)) {
      return;
    }

    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index].priority = updatedPriority;
      onImagesChange(newImages);
      return newImages;
    });
  };

  const [imageDelete] = useDeleteImageMutation();
  const handleDelete = async (url: string, imageId: number) => {
    if (url.startsWith("blob:")) {
      const updatedImages = images.filter((image) => image.url !== url);
      setImages(updatedImages);
      onImagesChange(updatedImages);
    } else {
      try {
        const result = await imageDelete(imageId).unwrap(); // Pass imageId, not id

        // After successful deletion, filter out the deleted image from state
        const updatedImages = images.filter((image) => image.id !== imageId);
        setImages(updatedImages);
        onImagesChange(updatedImages);
      } catch (error) { }
    }

    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((preview) => preview.preview !== url)
    );
  };

  const handleImagesChange = (newImages: Image[]) => {
    setImages(newImages);
  };

  const handleFileChange_old = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const files = e.target.files;
    // if (files) {
    //   const fileNames = Array.from(files).map((file) => file.name);
    //   setSelectedFileNames(fileNames);
    //   const previews = Array.from(files).map((file) =>
    //     URL.createObjectURL(file),
    //   );
    //   setImagePreviews(previews);
    // }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previews = Array.from(files).map((file) => ({
        preview: URL.createObjectURL(file),
        type: file.type,
      }));
      setImagePreviews(previews); // Store previews with types
    }
  };

  useEffect(() => {
    // Reset the attachment name input field when images change
    reset({ image_names: "" });
  }, [images, reset]);

  // Reusable Label component defined within ImageUploadForm
  const Label: React.FC<{ text: string }> = ({ text }) => (
    <p className="text-sm mb-2 text-gray-500 tracking-wide">{text}</p>
  );
  return (
    <FormProvider {...methods}>
      <div>
        {/* <h1>Attachment</h1> */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-4">
            {/* Reusable Label component */}
            {/* <Label text="File Name" />  */}
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
          <div className="col-span-12 md:col-span-2">
            <p className="text-sm mb-2 text-gray-500 tracking-wide">
              {prioritylabel}
            </p>
            <input
              type="number"
              {...methods.register("image_priority", { min: 0 })}
              placeholder="Priority"
              min="0"
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
                    onChange: (e) => {
                      handleFileChange(e); // Manually call your handler
                    },
                  })}
                  multiple
                  accept="image/*"
                  className="hidden w-full"
                />
              </label>
            </div>
            <div className="text-right py-4">
              {/* <pre>{JSON.stringify(selectedFileNames, null, 2)}</pre> */}

              {/* {selectedFileNames.length > 0 && (
                <ul className="file-name-list">
                  {selectedFileNames.map((name, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {name}
                    </li>
                  ))}
                </ul>
              )} */}

              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-4">
                  {imagePreviews.map((file, index) => {
                    console.log('file test',file)
                    return(
                        <div key={index} className="w-32 h-32 border rounded">
                          {file?.type === "application/pdf" ? (
                              <Image
                                  priority={true}
                                  src="/assets/Image/pdf.png"
                                  alt="PDF Icon"
                                  width={128}
                                  height={128}
                                  className="pdfIcon"
                              />
                          ) : file.type === "application/msword" ||
                          file.type ===
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                              <Image
                                  priority={true}
                                  src="/assets/Image/word.png"
                                  alt="Word Icon"
                                  width={128}
                                  height={128}
                                  className="wordIcon"
                              />
                          ) : (
                              <img
                                  src={file?.preview}
                                  alt={`Preview ${index}`}
                                  className="w-full h-full object-cover"
                              />
                          )}
                        </div>
                    )
                  })}
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
                  <th className="text-center">Priority</th>
                  <th className="text-center">Attachment</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* <pre>{JSON.stringify(images, null, 2)}</pre> */}
                {images.map((image: any, index: number) => {

                  return(
                      <tr key={index} className="relative">
                        <td className="text-left">{image.name}</td>
                        <td className="text-center">
                          <input
                              type="number"
                              value={
                                image.priority === null ||
                                image.priority === undefined
                                    ? ""
                                    : image.priority
                              }
                              onChange={(e) => handlePriorityChange(e, index)}
                              className="text-center border rounded w-16"
                          />
                        </td>
                        <td>

                          {image?.url?.split('.').pop() === "pdf" ? (
                              <a
                                  href={image.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                <Image
                                    priority={true}
                                    src="/assets/Image/pdf.png"
                                    alt="Logo"
                                    width="128"
                                    height="128"
                                    className="pdfIcon"
                                />
                              </a>
                          ) : image?.url?.split('.').pop() === "doc" || image?.url?.split('.').pop() === "docx" ? (
                              <a
                                  href={image?.url}
                              >
                                <Image
                                    priority={true}
                                    src="/assets/Image/wordd.png"
                                    alt={`Document Attachment for ${image?.name}`}
                                    width="128"
                                    height="128"
                                    className="pdfIcon"
                                />
                              </a>
                          ) : (
                              <a
                                  href={image.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <p className="px-5 transition flex gap-4 items-center text-textColor cursor-pointer">
                                      <img
                                          src={image.url}
                                          alt={`Uploaded ${index}`}
                                          className="uploadImage"
                                      />
                                    </p>
                                  </DialogTrigger>
                                  <DialogContent className="">
                                    <div className="bg-white rounded-sm p-2">
                                      <img
                                          src={image.url}
                                          alt={`Uploaded ${index}`}
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </a>
                          )}
                        </td>
                        <td className="action">
                          <button
                              type="button"
                              onClick={() => {
                                handleDelete(image?.url, image?.id);
                              }}
                              className="removeIcon"
                          >
                            <Trash2 />
                          </button>
                        </td>
                      </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </FormProvider>
  );
};

export default MultipleFileUploadNewEvent;
