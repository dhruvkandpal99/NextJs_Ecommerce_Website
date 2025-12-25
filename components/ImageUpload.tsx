'use client'

import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useCallback } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value,
  disabled
}) => {

  const handleUpload = useCallback((result: any) => {
    // When upload finishes, Cloudinary returns the URL in result.info.secure_url
    onChange(result.info.secure_url);
  }, [onChange]);

  return (
    <div>
      <CldUploadWidget 
        onSuccess={handleUpload} // NOTE: Changed from onUpload to onSuccess for v15+ compatibility
        uploadPreset="web_project"
        options={{
          maxFiles: 1
        }}
      >
        {({ open }) => {
          return (
            <div 
              onClick={() => open?.()}
              className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 border-gray-300 flex flex-col justify-center items-center h-64 gap-4 text-neutral-600 rounded-md bg-gray-50"
            >
              {/* Show preview if value exists */}
              {value ? (
                <div className="absolute inset-0 w-full h-full">
                  <Image 
                    fill 
                    style={{ objectFit: 'cover' }} 
                    src={value} 
                    alt="Upload" 
                    className="rounded-md"
                  />
                </div>
              ) : (
                // Show "Upload" placeholder if empty
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                </div>
              )}
            </div>
          )
        }}
      </CldUploadWidget>
    </div>
  );
}

export default ImageUpload;