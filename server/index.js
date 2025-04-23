const { client } = require("./common");
const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;
app.use(require("morgan")("dev"));
const {
  fetchRestaurants,
  fetchCustomers,
  fetchReservations,
  destroyReservation,
  createReservation,
  deleteCustomer,
} = require("./db");

app.listen(PORT, () => {
  console.log("listening on PORT", PORT);
});

const init = async () => {
  await client.connect();
};

app.get("/", (req, resp) => {
  resp.status(200).json({ message: "resp is working" });
});

app.get("/api/customers", async (req, resp, next) => {
  try {
    const response = await fetchCustomers();
    return resp.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/restaurants", async (req, resp, next) => {
  try {
    const response = await fetchRestaurants();
    return resp.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/reservations", async (req, resp, next) => {
  try {
    const response = await fetchReservations();
    return resp.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.post("/api/customers", async (req, res, next) => {
  try {
    const { cust_name } = req.body;
    const SQL = `
        INSERT INTO customers(cust_name) VALUES($1);
    `;
    const response = await client.query(SQL, [cust_name]);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { restaurant_id, date, party_count } = req.body;

    // Validate party_count is a number
    const parsedPartyCount = parseInt(party_count, 10);
    if (isNaN(parsedPartyCount)) {
      return res.status(400).json({ error: "party_count must be a number" });
    }

    const reservation = {
      restaurant_id: restaurant_id,
      date: date,
      party_count: party_count,
    };

    const newReservation = await createReservation(id, reservation);
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Reservation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      const { customer_id, id } = req.params;
      await destroyReservation(customer_id, id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

app.delete('api/customers/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCustomer(id);
    res.sendStatus(204);
  } catch (error) {
    next(error);
    console.error("could not delete")
  }
});

init();
