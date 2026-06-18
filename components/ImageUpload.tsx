'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, GripVertical, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/admin/ui';

interface ImageFile {
  file: File | null;
  url: string;
  id: string;
  order: number;
}

interface ImageUploadProps {
  images: ImageFile[];
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newImages: ImageFile[] = filesToAdd.map((file, index) => ({
      file,
      url: URL.createObjectURL(file),
      id: `${Date.now()}_${index}`,
      order: images.length + index,
    }));

    onImagesChange([...images, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    const updatedImages = images
      .filter((img) => img.id !== id)
      .map((img, index) => ({ ...img, order: index }));
    onImagesChange(updatedImages);
  };

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    const updatedImages = newImages.map((img, idx) => ({ ...img, order: idx }));
    onImagesChange(updatedImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => setDraggedIndex(null);
  const handleButtonClick = () => fileInputRef.current?.click();

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-700">Product images</p>
          <p className="mt-0.5 text-xs text-slate-400">
            Up to {maxImages} images · drag to reorder · the first is the primary.
          </p>
        </div>
        <Button
          type="button"
          onClick={handleButtonClick}
          disabled={images.length >= maxImages}
          variant="secondary"
          size="sm"
        >
          <Upload className="h-4 w-4" />
          Add images
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative cursor-move overflow-hidden rounded-lg border bg-white transition-all ${
                draggedIndex === index
                  ? 'border-green-500 opacity-50'
                  : 'border-slate-200 hover:border-green-400'
              }`}
            >
              <span className="absolute left-2 top-2 z-10 rounded-full bg-green-600 px-2 py-0.5 text-[0.625rem] font-bold text-white shadow">
                {index === 0 ? 'Primary' : `#${index + 1}`}
              </span>
              <span className="absolute right-2 top-2 z-10 rounded bg-slate-900/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <GripVertical className="h-3.5 w-3.5" />
              </span>

              {/* Preview uses a plain <img>: new uploads are blob: URLs which
                  the Next optimizer can't process. The product LIST uses
                  next/image for the optimized thumbnails. */}
              <div className="aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveImage(image.id)}
                className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="mb-1 h-7 w-7" />
                <span className="text-xs font-medium">Remove</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleButtonClick}
          className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition-colors hover:border-green-400 hover:bg-green-50/30"
        >
          <ImageIcon className="mb-3 h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-600">Click to upload images</p>
          <p className="mt-1 text-xs text-slate-400">PNG, JPG or WEBP — up to 10MB each</p>
        </button>
      )}
    </div>
  );
}
