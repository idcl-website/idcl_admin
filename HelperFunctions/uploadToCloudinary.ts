export const uploadToCloudinary = async (file: File): Promise<string | void> => {
    console.log('uploading the blog')
    try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset!);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            return data.secure_url;
        } else {

            return;
        }
    } catch (error) {

        return;
    }
};
