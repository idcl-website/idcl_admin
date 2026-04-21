"use client";

import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
    maxFiles?: number;
    onDrop: (files: File[]) => void;
}

// Maps MIME types to their common extensions for react-dropzone
const MIME_EXTENSIONS: Record<string, string[]> = {
    "image/jpeg": [".jpg"],
    "image/jpg":  [".jpg"],
    "image/png":  [".png"],
    "image/svg+xml": [".svg"],
    "image/gif":  [".gif"],
    "image/webp": [".webp"],
    "image/*":    [],
}

function buildAccept(accept?: string): Record<string, string[]> {
    if (!accept) return { "image/*": [] };
    return accept.split(",").reduce((acc, mime) => {
        const key = mime.trim();
        acc[key] = MIME_EXTENSIONS[key] ?? [];
        return acc;
    }, {} as Record<string, string[]>);
}

export function FileUploader({
    accept,
    maxSize,
    multiple = false,
    maxFiles = 1,
    onDrop,
}: FileUploaderProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: buildAccept(accept),
        maxSize,
        multiple,
        maxFiles,
        onDrop: (acceptedFiles) => {
            onDrop(acceptedFiles);
        },
        onDropRejected: (rejectedFiles) => {
            rejectedFiles.forEach(({ file, errors }) => {
                errors.forEach((err) => {
                    if (err.code === 'file-too-large') {
                        const limitMB = maxSize ? Math.round(maxSize / 1024 / 1024) : '?';
                        toast.error(`"${file.name}" exceeds the ${limitMB} MB size limit.`);
                    } else if (err.code === 'file-invalid-type') {
                        toast.error(`"${file.name}" is not a supported format. Use JPG, PNG or SVG.`);
                    } else {
                        toast.error(`"${file.name}" was rejected: ${err.message}`);
                    }
                });
            });
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
                        &ldquo;Drop the files here&rdquo;
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
