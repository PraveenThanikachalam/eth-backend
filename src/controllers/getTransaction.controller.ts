import { Request, Response } from "express";
import axios from "axios";
import prisma from "../prisma";

export default async function getTransactionController(
  req: Request,
  res: Response
): Promise<Response> {
  const apiKey: string = process.env.ETHER_SCAN_API_KEY || "";
  try {
    const { address } = req.params;

    if (!address) return res.status(404).json({ message: "Invalid address" });

    const response = await axios.get(`https://api.etherscan.io/api`, {
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
      await prisma.transaction.create({
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
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
}
