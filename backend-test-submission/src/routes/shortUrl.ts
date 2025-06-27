import express from "express";
import { PrismaClient } from "@prisma/client";
import shortener from "../controller/shortener";

const prisma = new PrismaClient();

const router = express.Router();

router.post("/", async (req, res) => {
  const { originalUrl, validity, shortCode } = req.body;
  const data= await shortener(originalUrl, validity, shortCode);
  
  res.status(201).send({
    shortLink: data.shortenedUrl,
    expiry: data.expiryTime,
  });
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const url = await prisma.url.findUnique({
    where: {
      id,
    },
    select: {
      shortenedUrl: true,
      expiryTime: true,
    },
  });
  if (!url) {
    res.status(404).send("Url not found");
    return;
  }
  if (url.expiryTime < new Date()) {
    res.status(404).send("Url expired");
    return;
  }
  res.send(url.shortenedUrl);
});

export default router;