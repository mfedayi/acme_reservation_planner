//const { client } = require("./db");
const pg = require("pg");
require("dotenv").config();
const client = new pg.Client(process.env.DATABASE_URL);

const init = async () => {
  try {
    await client.connect();
    const SQL = `
       DROP TABLE IF EXISTS customers CASCADE;
       DROP TABLE IF EXISTS restaurants CASCADE;
       DROP TABLE IF EXISTS reservations CASCADE; 
       CREATE TABLE customers(
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       cust_name VARCHAR(100)
       );
       CREATE TABLE restaurants(
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       rest_name VARCHAR(100) 
       );
       CREATE TABLE reservations(
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       date DATE NOT NULL,
       party_count INTEGER NOT NULL,
       restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
       customer_id UUID REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL
       );
       INSERT INTO customers(cust_name) VALUES('Bob');
       INSERT INTO customers(cust_name) VALUES('Jon');
       INSERT INTO restaurants(rest_name) VALUES('BJs');
       INSERT INTO restaurants(rest_name) VALUES('Clydes');
       INSERT INTO reservations(party_count, restaurant_id, customer_id, date ) VALUES(
       6, 
       (SELECT id FROM restaurants WHERE rest_name = 'Clydes'),
       (SELECT id FROM customers WHERE cust_name = 'Bob'),
       '2025-05-21'
       );
       INSERT INTO reservations(party_count, restaurant_id, customer_id, date ) VALUES(
       6, 
       (SELECT id FROM restaurants WHERE rest_name = 'BJs'),
       (SELECT id FROM customers WHERE cust_name = 'Jon'),
       '2025-05-23'
       );
    `;
    await client.query(SQL);
    await client.end();
    console.log("DB is SEEDED");
  } catch (error) {
    console.error(error);
  }
};
init();
