import http from './http';

type IP = string;

async function getConfiguration(ips: Array<IP>) {
  const res = await http.post('/configuration', {
    address: ips,
  });

  return res.data;
}

export default getConfiguration;
