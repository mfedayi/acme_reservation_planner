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

app.get("/api/customers", async (req, resp) => {
  try {
    const response = await fetchCustomers();
    return resp.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/restaurants", async (req, resp) => {
  try {
    const response = await fetchRestaurants();
    return resp.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.get("/api/reservations", async (req, resp) => {
  try {
    const response = await fetchReservations();
    return resp.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

app.post('/api/customers/:id/reservations', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { party_count, restaurant_id, date } = req.body;

    // Validate it
    if (isNaN(party_count)) {
      return res
        .status(400)
        .send({ error: "Invalid party_count; must be a number." });
    }

    const newReservation = await createReservation(
      party_count,
      restaurant_id,
      id,
      date,
    );
    res.status(201).send(newReservation);
  } catch (error) {
    next(error);
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

init();
