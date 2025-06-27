import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function shortener(originalUrl: string, validity: number, shortCode: string) {

    const shortenedUrl = await axios.post(
        "https://api.bitly.com/v4/shorten",
        {
        access_token: process.env.BITLY_ACCESS_TOKEN,
        long_url: originalUrl,
        }
    );
    const expiryTime = new Date();
    expiryTime.setDate(expiryTime.getDate() + 7);
    const data = await prisma.url.create({
        data: {
        originalUrl,
        shortenedUrl: shortenedUrl.data.link,
        expiryTime,
        },
    });
    return data;
}