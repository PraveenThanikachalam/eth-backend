import axios from "axios";
import prisma from "../prisma";

const COINGECKO_API_URL = process.env.COINGECKO_API_URL || "";

async function fetchAndStoreEthereumPrice(): Promise<void> {
  try {
    const response = await axios.get(COINGECKO_API_URL);

    const ethPrice = response.data.ethereum.inr.toString();

    await prisma.ethereumPrise.create({
      data: {
        price: ethPrice,
      },
    });

    console.log(`Ethereum price stored: ₹${ethPrice}`);
  } catch (error) {
    console.error("Error fetching or storing Ethereum price:", error);
  }
}

export default fetchAndStoreEthereumPrice;
