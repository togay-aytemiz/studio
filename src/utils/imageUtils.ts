/**
 * Resizes an image file to a maximum dimension while maintaining aspect ratio
 * and compressing it to reduce file size.
 * 
 * @param file The original File object
 * @param maxDimension The maximum width or height in pixels (default: 2048)
 * @param quality The JPEG quality between 0 and 1 (default: 0.9)
 * @returns A Promise that resolves to a new, resized File object
 */
export const resizeImage = (
    file: File,
    maxDimension: number = 2048,
    quality: number = 0.9
): Promise<File> => {
    return new Promise((resolve, reject) => {
        // If it's not an image, return original
        if (!file.type.match(/image.*/)) {
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            const image = new Image();
            image.onload = () => {
                // Calculate new dimensions
                let width = image.width;
                let height = image.height;

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round(height * (maxDimension / width));
                        width = maxDimension;
                    } else {
                        width = Math.round(width * (maxDimension / height));
                        height = maxDimension;
                    }
                }

                // Create canvas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Draw image on canvas
                ctx.drawImage(image, 0, 0, width, height);

                // Convert to Blob/File
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Could not compress image'));
                        return;
                    }

                    // Create new file with same name but likely different size
                    // Changing type to jpeg helps with compression if original was heavy png
                    const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });

                    resolve(newFile);
                }, 'image/jpeg', quality);
            };
            image.onerror = (e) => reject(e);

            if (readerEvent.target?.result) {
                image.src = readerEvent.target.result as string;
            } else {
                reject(new Error('Could not read file'));
            }
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
};
