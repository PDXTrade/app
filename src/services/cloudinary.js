// good idea to externalize this to .env config
const cloudinaryUser = 'onnom';
const FETCH_URL = `http://res.cloudinary.com/${cloudinaryUser}/image/fetch`;

export const getURL = (fileName, options = '') => {
  return `${FETCH_URL}/${options}/${encodeURIComponent(fileName)}`;
};