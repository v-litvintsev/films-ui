export const fetcher = async (url: string, options: RequestInit = {}) => {
  let response;

  if (!options) {
    response = await fetch(url);
  } else {
    response = await fetch(url, options);
  }

  const data = await response.json();
  return data;
};
