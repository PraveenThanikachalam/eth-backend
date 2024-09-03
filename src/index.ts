import express from "express";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactionRoutes";
import userExpenses from "./routes/userExpenses";
import fetchAndStoreEthereumPrice from "./Utils/fetchPrice";

dotenv.config();
const port = process.env.PORT || 3001;
const app = express();

app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/useExpenses", userExpenses);

fetchAndStoreEthereumPrice();

app.listen(port, () => {
  console.log(`Listening on port - ${port}`);
});
