import axios from 'axios';

const API_KEY = '52855344-2930eb43dc046f1677ebd214e';

export default async function getImagesByQuery(query, page = 1) {
  const result = await axios('https://pixabay.com/api/', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 15,
      page,
    },
  });

  return result.data;
}
