const { Pool, Client } = require("pg");
const connectionString =
  "postgresql://postgres:postgres@localhost:5432/firstapi";

const pool = new Pool({
  connectionString: connectionString,
});
pool.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
});

const client = new Client({
  connectionString: connectionString,
});

client.connect();
client.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
});

const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.status(200).json(response.rows);
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  res.json(response.rows);
};

const createUser = async (req, res) => {
  const { name, email } = req.body;
  const response = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2)",
    [name, email]
  );
  res.json({
    message: "User Added successfully",
    body: {
      user: { name, email },
    },
  });
};

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const response = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3",
    [name, email, id]
  );
  res.json("User Updated Successfully");
};

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  await pool.query("DELETE FROM users where id = $1", [id]);
  res.json(`User ${id} deleted Successfully`);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
