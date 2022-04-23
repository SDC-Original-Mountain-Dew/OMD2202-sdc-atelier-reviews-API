import http from 'k6/http';

export let options = {
  insercureSkipTLSVerify: true,
  noConnectionReuse: false,
  vus: 6000,
  duration: '1m',
  // stages: [
  //   { duration: '5s', target: 20 }, // below normal load
  //   { duration: '20s', target: 50 },
  //   { duration: '5s', target: 100 }, // normal load
  //   { duration: '20s', target: 100 },
  //   { duration: '5s', target: 20 }, // around the breaking point
  //   { duration: '10s', target: 0 },
  // ],
};

export default () => {
  http.get(`http://localhost:3001/reviews/meta?product_id=${Math.floor(Math.random() * 1000000)}`)
}