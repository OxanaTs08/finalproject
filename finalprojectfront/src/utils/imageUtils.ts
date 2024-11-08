export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// для нескольких файлов
export const convertMultipleFilesToBase64 = async (
  files: FileList
): Promise<string[]> => {
  const base64Images: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const base64 = await convertToBase64(files[i]);
    base64Images.push(base64);
  }
  return base64Images;
};
