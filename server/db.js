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
  customer_id,
  { restaurant_id, date, party_count }
) => {
  const SQL = `
    INSERT INTO reservations (
      customer_id,
      restaurant_id,
      date,
      party_count
    ) VALUES (
      (SELECT id FROM customers WHERE id = $1),
      (SELECT id FROM restaurants WHERE id = $2),
      $3,
      $4
    )
    RETURNING *;
  `;

  const response = await client.query(SQL, [
    customer_id,
    restaurant_id,
    date,
    party_count,
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

const deleteCustomer = async (id) => {
  const SQL = "DELETE FROM customers WHERE id=$1";
  const response = await client.query(SQL, [id]);
  return response;
};

module.exports = {
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation,
  createReservation,
  deleteCustomer,
};
