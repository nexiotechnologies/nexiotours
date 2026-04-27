import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage, AdvancedVideo } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME
  }
});

export const CloudinaryImage = ({ publicId, alt, className, width, height }) => {
  if (!publicId) return null;

  // If it's already a full URL (external or processed), just use a regular img tag
  if (publicId.includes('http')) {
    const url = publicId.startsWith('http') ? publicId : publicId.substring(publicId.indexOf('http'));
    return <img src={url} alt={alt} className={className} style={{ width: width || '100%', height: height || '100%', objectFit: 'cover' }} />;
  }

  const myImage = cld.image(publicId);

  // Apply optimizations
  myImage
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(width || 800).height(height || 600));

  return (
    <AdvancedImage 
      cldImg={myImage} 
      alt={alt || ''} 
      className={className}
      placeholder="blur"
    />
  );
};

export const CloudinaryVideo = ({ publicId, className }) => {
  if (!publicId) return null;

  const myVideo = cld.video(publicId);

  return (
    <AdvancedVideo 
      cldVid={myVideo} 
      controls 
      className={className}
    />
  );
};
