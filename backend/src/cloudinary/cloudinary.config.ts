import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({

  cloud_name: 'ghumodlh',
  api_key: '271191134515749',
  api_secret: 'W1v99iMsVnJYNgwVbippYk8HzS0',

});

console.log('Cloudinary configured:', {
  cloudName: !!cloudinary.config().cloud_name,
  apiKey: !!cloudinary.config().api_key,
  apiSecret: !!cloudinary.config().api_secret,
});

export default cloudinary;