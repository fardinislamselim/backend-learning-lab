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
      email VARCHAR(20) NOT NULL,
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

initDB()

app.post("/", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  res.status(201).json({
    message: "Created!",
    data: { name, email },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
