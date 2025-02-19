import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import {FileText, Plus, Trash2} from "lucide-react";
import React, {useEffect, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";
import "./style.multiUpload.css";

interface ImageUploadFormProps {
    archiveAgreement: any,
    onImagesChange: (images: { url: string; file: File; name: string, base64: string }[]) => void;
}

interface Image {
    url: string;
    file: File;
    name: string;
    base64: string
}

const ImageUploadFormEdit: React.FC<ImageUploadFormProps> = ({ onImagesChange,
                                                                 archiveAgreement
                                                             }) => {
    const methods = useForm();
    const {handleSubmit, reset} = methods;
    const [images, setImages] = useState<Image[]>([]);

    // const handleUpload = () => {
    //   const formData = methods.getValues(); // Get form data using react-hook-form method
    //   const files: FileList = formData.images;
    //   const imageNames: string[] = formData.image_names
    //     .split(",")
    //     .map((name: string) => name.trim());
    //   const imageUrls: Image[] = [];
    //   for (let i = 0; i < files.length; i++) {
    //     const file = files[i];
    //     const url = URL.createObjectURL(file);
    //     const name = imageNames[i] || `Image ${i + 1}`; // Ensure a name is always present

    //     imageUrls.push({ url, file, name });
    //   }
    //   setImages((prevImages) => [...prevImages, ...imageUrls]);
    //   // Callback to parent component
    //   onImagesChange([...images, ...imageUrls]);
    //   reset();
    // };

    const handleUpload = () => {
        const formData = methods.getValues(); // Get form data using react-hook-form method
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
                        url: URL.createObjectURL(file),
                        file,
                        name: imageNames[i] || `Image ${i + 1}`,
                        base64: base64String,
                    });
                };
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises)
            .then((newImages) => {
                setImages((prevImages) => [...prevImages, ...newImages]);
                onImagesChange([...images, ...newImages]);
                // reset();
            })
            .catch((error) => console.error("Error uploading images:", error));
    };

    const handleDelete = (url: string) => {
        const updatedImages = images.filter((image) => image.url !== url);
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    const handleImagesChange = (newImages: Image[]) => {
        setImages(newImages);
    };

    useEffect(() => {
        // Reset the attachment name input field when images change
        reset({image_names: ''});
    }, [images, reset]);

    return (
        <FormProvider {...methods}>
            <div>
                <h1>Attachment</h1>
                <div className="grid grid-cols-12 gap-5 ">
                    <div className="col-span-12 md:col-span-6">
                        <p className="text-sm mb-2 text-gray-500 tracking-wide">File Name</p>
                        <input
                            type="text"
                            {...methods.register("image_names")}
                            placeholder="Attachment Nmae)"
                            className="flex h-10 w-full focus-visible:outline-[#30329E] text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 m-0 p-0 bg-white border-[1px] rounded-md border-[#cccccc] outline-none px-2"
                        />{" "}
                        {/* Input field for image names */}
                    </div>
                    <div className="col-span-12 md:col-span-6">
                        <p className="text-sm mb-2 text-gray-500 tracking-wide">Attachment</p>
                        <div className="flex items-center justify-center ">

                            <label
                                className="rounded-lg border-2 w-full h-10 text-center flex items-center justify-center cursor-pointer">
                                <p className="pointer-none text-gray-500 "> + Attachment</p>
                                <input
                                    type="file"
                                    {...methods.register("images")}
                                    multiple
                                    accept="image/*"
                                    className="hidden w-full"
                                />
                            </label>
                        </div>
                        <div className="text-right py-4">
                            <Button
                                type="button"
                                onClick={handleUpload}
                                className="bg-green-600 hover:bg-green-600"
                            >
                                <Plus/> Upload
                            </Button>
                        </div>
                    </div>
                </div>
                {images.length > 0 && (
                    <div style={{display: "flex", flexWrap: "wrap"}}>
                        <table>
                            <tr>
                                <th>File Name</th>
                                <th>Attachment</th>
                                <th>Action</th>
                            </tr>
                            {images.map((image: any, index: number) => (
                                <tr key={index} className="relative">
                                    <td>{image.name}</td>
                                    <td>
                                        {image?.file?.type === "application/pdf" ? (
                                            <>
                                                <a
                                                    href={image.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <FileText className="pdfIcon"/>
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                {/* <img
                        src={image.url}
                        alt={`Uploaded ${index}`}
                        className="uploadImage"
                      /> */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <p className="px-5 transition flex gap-4 items-center text-textColor cursor-pointer">
                                                            {" "}
                                                            <img
                                                                src={image.url}
                                                                alt={`Uploaded ${index}`}
                                                                className="uploadImage"
                                                            />
                                                        </p>
                                                    </DialogTrigger>
                                                    <DialogContent className="">
                                                        <div className="bg-white rounded-sm m-5 p-2">

                                                            <img
                                                                src={image.url}
                                                                alt={`Uploaded ${index}`}
                                                            />

                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </>
                                        )}

                                    </td>
                                    <td className="action">
                                        <button
                                            onClick={() => handleDelete(image.url)}
                                            className="removeIcon"
                                        >
                                            <Trash2/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </table>
                        {/* {images.map((image, index) => (
            <div key={index} style={{ margin: "10px", position: "relative" }}>
              <h2>{image.name}</h2>
              <img
                src={image.url}
                alt={`Uploaded ${index}`}
                style={{ width: "100px", height: "100px" }}
              />
              <button
                onClick={() => handleDelete(image.url)}
                style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
          ))} */}
                    </div>
                )}
            </div>
        </FormProvider>
    );
};

export default ImageUploadFormEdit;
