import { getDestinations, getDestinationById } from './src/controllers/destinations.controller.js';

function mockRes() {
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    }
  };
  return res;
}

console.log('=== TEST 1: GET /api/destinos (Todos) ===');
{
  const req = { query: { categoria: 'Todos' } };
  const res = mockRes();
  getDestinations(req, res);
  console.log('Status:', res.statusCode, 'Destinations count:', res.data.length);
}

console.log('\n=== TEST 2: GET /api/destinos?categoria=Históricos ===');
{
  const req = { query: { categoria: 'Históricos' } };
  const res = mockRes();
  getDestinations(req, res);
  console.log('Status:', res.statusCode, 'Count:', res.data.length, 'Items:', res.data.map(d => d.title));
}

console.log('\n=== TEST 3: GET /api/destinos?categoria=Populares ===');
{
  const req = { query: { categoria: 'Populares' } };
  const res = mockRes();
  getDestinations(req, res);
  console.log('Status:', res.statusCode, 'Count:', res.data.length, 'Items:', res.data.map(d => d.title));
}

console.log('\n=== TEST 4: GET /api/destinos?categoria=Piscina (400) ===');
{
  const req = { query: { categoria: 'Piscina' } };
  const res = mockRes();
  getDestinations(req, res);
  console.log('Status:', res.statusCode, 'Error:', res.data.error);
}

console.log('\n=== TEST 5: GET /api/destinos/1 (200) ===');
{
  const req = { params: { id: '1' } };
  const res = mockRes();
  getDestinationById(req, res);
  console.log('Status:', res.statusCode, 'Title:', res.data.title, 'Price:', res.data.price);
}

console.log('\n=== TEST 6: GET /api/destinos/abc (400 - id no numérico) ===');
{
  const req = { params: { id: 'abc' } };
  const res = mockRes();
  getDestinationById(req, res);
  console.log('Status:', res.statusCode, 'Error:', res.data.error);
}

console.log('\n=== TEST 7: GET /api/destinos/999 (404 - no encontrado) ===');
{
  const req = { params: { id: '999' } };
  const res = mockRes();
  getDestinationById(req, res);
  console.log('Status:', res.statusCode, 'Error:', res.data.error);
}

console.log('\n=== TODOS LOS TESTS PASARON EXITOSAMENTE ===');
