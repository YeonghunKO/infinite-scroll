const API_END_POINT = 'https://jsonplaceholder.typicode.com/';

const request = async (limit, page) => {
  try {
    const data = await fetch(
      API_END_POINT + `posts?_limit=${limit}&_page=${page}`
    );
    if (!data.ok) {
      console.log('API requested failed');
    }
    return data.json();
  } catch (error) {
    console.log(error);
  }
};

export { request };
