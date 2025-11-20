import axios from 'axios';

export function useApi() {
  const client = axios.create({
    baseURL: '/api',
    withCredentials: true,
  });

  const get = (url, opts) => client.get(url, opts).then(r => r.data);
  const post = (url, body, opts) => client.post(url, body, opts).then(r => r.data);
  const put = (url, body, opts) => client.put(url, body, opts).then(r => r.data);
  const del = (url, opts) => client.delete(url, opts).then(r => r.data);

  return { get, post, put, del, client };
}

export default useApi;
