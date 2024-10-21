const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const express = require("express");
const PORT = 3000;
let db;
const app = express();
(async () => {
  db = await open({
    filename: "./Assignment1/database.sqlite",
    driver: sqlite3.Database,
  });
  if (db) {
    console.log("Successfully connected to the database");
  } else {
    console.log("Error while connecting to the database");
  }
})();

async function fetchAllRestaurants() {
  const query = `SELECT * FROM restaurants`;
  const response = await db.all(query, []);
  return { restaurants: response };
}

async function getRestaurantById(id) {
  const query = `SELECT * FROM restaurants WHERE id = ?`;
  const response = await db.all(query, [id]);
  return { restaurant: response };
}

async function getRestaurantByCuisine(cuisine) {
  const query = `SELECT * FROM restaurants WHERE cuisine = ?`;
  const response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

async function getRestaurantByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  const query = `SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?`;
  const response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

async function fetchRestaurantsSortedByRating() {
  const query = `SELECT * FROM restaurants ORDER BY rating DESC`;
  const response = await db.all(query, []);
  return { restaurants: response };
}

async function fetchAllDishes() {
  const query = `SELECT * FROM dishes`;
  const response = await db.all(query, []);
  return { dishes: response };
}

async function getDishesById(id) {
  const query = `SELECT * FROM dishes WHERE id = ?`;
  const response = await db.all(query, [id]);
  return { dish: response };
}

async function getDishesByFilter(isVeg) {
  const query = `SELECT * FROM dishes WHERE isVeg = ?`;
  const response = await db.all(query, [isVeg]);
  return { dishes: response };
}

async function fetchDishesSortedByPrice() {
  const query = `SELECT * FROM dishes ORDER BY price`;
  const response = await db.all(query, []);
  return { dishes: response };
}

app.get("/restaurants", async (req, res) => {
  try {
    const results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/restaurants/details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const results = await getRestaurantById(id);
    if (results.restaurant.length === 0) {
      return res.status(404).json({ message: "No restaurants found." });
    }
    res.status(200).json({ restaurant: results.restaurant[0] });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    const results = await getRestaurantByCuisine(cuisine);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/restaurants/filter", async (req, res) => {
  try {
    const isVeg = req.query.isVeg;
    const hasOutdoorSeating = req.query.hasOutdoorSeating;
    const isLuxury = req.query.isLuxury;
    const results = await getRestaurantByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury,
    );
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    const results = await fetchRestaurantsSortedByRating();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/dishes", async (req, res) => {
  try {
    const results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: "No dishes found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/dishes/details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const results = await getDishesById(id);
    if (results.dish.length === 0) {
      return res.status(404).json({ message: "No dishes found." });
    }
    res.status(200).json({dish: results.dish[0]});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/dishes/filter", async (req, res) => {
  try {
    const isVeg = req.query.isVeg;
    const results = await getDishesByFilter(isVeg);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: "No dishes found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    const results = await fetchDishesSortedByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: "No dishes found." });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server started listening on ${PORT}`));
