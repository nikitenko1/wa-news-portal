import Resizer from 'react-image-file-resizer';

export const resizeImage = (file) =>
  // eslint-disable-next-line no-undef
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'base64'
    );
  });
