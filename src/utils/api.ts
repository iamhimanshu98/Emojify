export const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export const detectEmotion = async (image: File, modelType: "tensorflow" | "deepface") => {
    const base64Image = await convertImageToBase64(image);

    const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            image: base64Image,
            model: modelType,
        }),
    });

    const data = await response.json();
    return data; // Return emotion data
};
