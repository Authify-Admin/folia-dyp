import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from './firebase';

export interface UploadedImage {
  url: string;
  path: string;
  order: number;
}

// Upload multiple images for a product
export const uploadProductImages = async (
  productId: string,
  files: File[]
): Promise<UploadedImage[]> => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${index}_${file.name}`;
      const storageRef = ref(storage, `products/${productId}/${fileName}`);

      // Upload the file
      await uploadBytes(storageRef, file);

      // Get the download URL
      const url = await getDownloadURL(storageRef);

      return {
        url,
        path: storageRef.fullPath,
        order: index,
      };
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

// Upload a single image
export const uploadSingleImage = async (
  productId: string,
  file: File
): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `products/${productId}/${fileName}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Delete an image from storage
export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Delete all images for a product
export const deleteProductImages = async (productId: string): Promise<void> => {
  try {
    const folderRef = ref(storage, `products/${productId}`);
    const fileList = await listAll(folderRef);

    const deletePromises = fileList.items.map((item) => deleteObject(item));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting product images:', error);
    throw error;
  }
};

// Get all images for a product
export const getProductImages = async (productId: string): Promise<string[]> => {
  try {
    const folderRef = ref(storage, `products/${productId}`);
    const fileList = await listAll(folderRef);

    const urlPromises = fileList.items.map((item) => getDownloadURL(item));
    const urls = await Promise.all(urlPromises);

    return urls;
  } catch (error) {
    console.error('Error getting product images:', error);
    return [];
  }
};

// Upload a Plant Doctor photo from the public contact form.
// Reuses the customer-writable `returns/` namespace on purpose: Storage rules
// only allow anonymous (unauthenticated) writes under products/ and returns/,
// so a dedicated `plant-doctor/` path would be denied on the live site until
// the storage rules are redeployed. Returns the public download URL.
export const uploadPlantDoctorImage = async (file: File): Promise<string> => {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `returns/plant-doctor/${timestamp}_${safeName}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Upload multiple images for a return request
export const uploadReturnImages = async (
  files: File[],
  orderNumber: string
): Promise<string[]> => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${index}_${file.name}`;
      const storageRef = ref(storage, `returns/${orderNumber}/${fileName}`);

      // Upload the file
      await uploadBytes(storageRef, file);

      // Get the download URL
      const url = await getDownloadURL(storageRef);

      return url;
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading return images:', error);
    throw error;
  }
};
