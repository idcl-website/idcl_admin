"use client";

import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";

interface FileUploaderProps {
    accept: string;
    maxSize: number;
    multiple?: boolean;
    maxFiles?: number;
    onDrop: (files: File[]) => void;
}

export function FileUploader({
    accept,
    maxSize,
    multiple = false,
    maxFiles = 1,
    onDrop,
}: FileUploaderProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: accept.split(",").reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {} as Record<string, string[]>),
        maxSize,
        multiple,
        maxFiles,
        onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles);
        },
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "flex flex-col items-center bg-[#F8F8FF] justify-center rounded-lg border border-dashed p-6 cursor-pointer transition-colors",
                isDragActive
                    ? "border-primary/50 bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"
            )}
            style={{ borderColor: '#384EB74D' }}
        >
            <input {...getInputProps()} id="file-upload-input" />
            <UploadIcon className="h-6 w-6 text-muted-foreground" />
                {isDragActive ? (
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                        "Drop the files here"
                    </p>
                ) : (   
                    <>
                        <p className="font-mulish font-bold text-[16px] leading-[24px] text-[#0F0F0F]">
                            Drag & drop {multiple ? "files" : "a file"} here, or{" "}
                            <span
                                className="text-[#483EA8] cursor-pointer underline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById('file-upload-input')?.click();
                                }}
                            >
                                Browse
                            </span>
                        </p>
                        <br />
                        <span className="text-[#676767] font-mulish text-[12px] font-normal leading-[18px]">
                            Supported formates: .png .svg - priortize svg image to avoid pixelation
                        </span>
                    </>
                )}
        </div>
    );
}
