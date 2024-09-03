"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getTransactionController;
const axios_1 = __importDefault(require("axios"));
const prisma_1 = __importDefault(require("../prisma"));
function getTransactionController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = process.env.ETHER_SCAN_API_KEY || "";
        try {
            const { address } = req.params;
            if (!address)
                return res.status(404).json({ message: "Invalid address" });
            const response = yield axios_1.default.get(`https://api.etherscan.io/api`, {
                params: {
                    module: "account",
                    action: "txlist",
                    address: address,
                    startblock: 0,
                    endblock: 99999999,
                    page: 1,
                    offset: 10,
                    sort: "asc",
                    apikey: apiKey,
                },
            });
            const transactions = response.data.result;
            for (const tx of transactions) {
                yield prisma_1.default.transaction.create({
                    data: {
                        address,
                        hash: tx.hash,
                        value: tx.value,
                        gasUsed: tx.gasUsed,
                        gasPrice: tx.gasPrice,
                    },
                });
            }
            return res.json({
                message: "Successfully added to DB",
                transactions,
            });
        }
        catch (error) {
            console.error("Error fetching transactions:", error);
            return res.status(500).json({ error: "Failed to fetch transactions" });
        }
    });
}
