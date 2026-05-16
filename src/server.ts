import { config } from "dotenv";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import pg, { Pool } from "pg";

config();

const app: Application = express();
const port = 5000;

app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World!" });
});

const initDB = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(20) ,
      email VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  } catch (error) {
    console.log(`DB connection Error ${error}`);
  }
};

initDB();

app.post("/", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;
  try {
    const result = await pool.query(
      `
    INSERT INTO users (name, email, password, age)VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, password, age],
    );
    console.log(result.rows[0]);
    res.status(201).json({
      message: "Created!",
      data: result.rows[0],
    });
  } catch (error:any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
