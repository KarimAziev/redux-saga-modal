const generateRandomNums = (max, min) => Math.random() * (max - min) + min;

const mockApi = (
  delay = generateRandomNums(2000, 1000),
  resp = { status: 'ok' }
) => new Promise((resolve, reject) => setTimeout(() => resolve(resp), delay));

const api = {
  save: mockApi,
  fetch: mockApi,
};

export default api;
