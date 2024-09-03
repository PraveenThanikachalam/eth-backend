"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const userExpenses_1 = __importDefault(require("./routes/userExpenses"));
const fetchPrice_1 = __importDefault(require("./Utils/fetchPrice"));
dotenv_1.default.config();
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/transactions", transactionRoutes_1.default);
app.use("/api/useExpenses", userExpenses_1.default);
app.get("/", (req, res) => {
    res.send("Server Started");
});
(0, fetchPrice_1.default)();
app.listen(port, () => {
    console.log(`Listening on port - ${port}`);
});
