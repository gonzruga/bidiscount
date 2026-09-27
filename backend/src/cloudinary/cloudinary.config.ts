import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({

  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,

});

console.log('Cloudinary configured:', {
  cloudName: !!cloudinary.config().cloud_name,
  apiKey: !!cloudinary.config().api_key,
  apiSecret: !!cloudinary.config().api_secret,
});

export default cloudinary;