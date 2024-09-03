import axios from "axios";
import { Request, Response } from "express";
import prisma from "../prisma";

export default async function Expenses(req: Request, res: Response) {
  const { address } = req.params;
  const apiKey: string = process.env.ETHER_SCAN_API_KEY || "";

  if (!address) {
    return res
      .status(400)
      .json({ error: "Address query parameter is required" });
  }

  try {
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

    let totalExpenses = 0;
    transactions.forEach((tx: any) => {
      const gasUsed = Number(tx.gasUsed);
      const gasPrice = Number(tx.gasPrice);
      const expense = (gasUsed * gasPrice) / 1e18;
      totalExpenses += expense;
    });

    const currentEthValue = await prisma.ethereumPrise.findFirst({
      select: {
        price: true,
      },
    });

    const ethPrice = currentEthValue ? currentEthValue.price : null;

    console.log("Current Ethereum Price:", ethPrice);

    res.json({
      address: address,
      totalExpensesInEther: totalExpenses,
      ethPrice,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
}
