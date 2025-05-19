export const getCroppedImg = (
    imageSrc: string,
    crop: { x: number; y: number; width: number; height: number },
    size: number = 200
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = imageSrc;

        image.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            ctx.drawImage(
                image,
                crop.x,
                crop.y,
                crop.width,
                crop.height,
                0,
                0,
                size,
                size
            );

            const base64Image = canvas.toDataURL("image/png");
            resolve(base64Image);
        };

        image.onerror = (e) => reject(new Error("Failed to load image"));
    });
};
