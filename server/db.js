const { client } = require("./common");

const fetchCustomers = async () => {
  const SQL = `
  SELECT * FROM customers 
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchRestaurants = async () => {
  const SQL = `
  SELECT * FROM restaurants
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchReservations = async () => {
  const SQL = `
  SELECT * FROM reservations
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createReservation = async (
  party_count,
  restaurant_id,
  customer_id,
  date
) => {
  const SQL = `
   INSERT INTO reservations(party_count, restaurant_id, customer_id, date) 
   VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const response = await client.query(SQL, [
    parseInt(party_count, 10),
    restaurant_id,
    customer_id,
    date,
  ]);
  return response.rows[0];
};

const destroyReservation = async (customer_id, id) => {
  const SQL = `
  DELETE FROM reservations
  WHERE customer_id = $1 AND id = $2
  `;
  await client.query(SQL, [customer_id, id]);
};

module.exports = {
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation,
  createReservation,
};
