export const getPlaceholderImage = (width = 150, height = 150) => {
    const localPlaceholder = '/assets/placeholder.png';

    const generateSVGPlaceholder = () => {
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f8f9fa"/>
            <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#6c757d" 
                  dominant-baseline="middle" text-anchor="middle">No Image</text>
        </svg>`;
        return `data:image/svg+xml;base64,${btoa(svg.trim())}`;
    };

    const fallbackOptions = [
        '/assets/default-avatar.png',
        '/logo.png',
        generateSVGPlaceholder()
    ];

    const validateImage = async (url) => {
        if (url instanceof File) {
            return url.type.startsWith('image/');
        }
        if (url.startsWith('data:')) return true;
        try {
            const img = new Image();
            const imagePromise = new Promise((resolve, reject) => {
                img.onload = () => resolve(true);
                img.onerror = () => reject(false);
            });
            img.src = url;
            return await imagePromise;
        } catch {
            return false;
        }
    };

    const handleFileUpload = (file) => {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith('image/')) {
                reject(new Error('Invalid file type'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    return { localPlaceholder, fallbackOptions, validateImage, handleFileUpload };
};

// Add a utility function for direct use
export const getFirstValidImage = async (width = 150, height = 150) => {
    const { localPlaceholder, fallbackOptions, validateImage } = getPlaceholderImage(width, height);

    // Try local placeholder first
    if (await validateImage(localPlaceholder)) {
        return localPlaceholder;
    }

    // Try fallback options
    for (const option of fallbackOptions) {
        if (await validateImage(option)) {
            return option;
        }
    }

    // Return the SVG as final fallback
    return fallbackOptions[fallbackOptions.length - 1];
};
