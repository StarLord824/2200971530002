import express from "express";
import { PrismaClient } from "@prisma/client";
import shortener from "../controller/shortener";
import shortCodeGenerator from "../controller/shortCodeGenerator";

const prisma = new PrismaClient();

const router = express.Router();

router.post("/", async (req, res) => {
  let { url, validity, shortCode } = req.body;
  
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'Invalid or missing URL' });
  }

  if(!validity || typeof validity !== 'number'){
    validity=30;
    console.log('Validity is not provided, defaulting to 30 days');
  }
  if(!shortCode){
    shortCode= shortCodeGenerator();
    console.log('Shortcode is not provided, generated random one: '+shortCode);
  }
  
  const data= await shortener(url, validity, shortCode);
  
  res.status(201).send({
    shortLink: data.shortenedUrl,
    expiry: data.expiryTime,
  });
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  const entry = await prisma.url.findUnique({
    where: {
      shortenedUrl: id,
    },
    include: {
      analytics: true,
    },
  });

  if (!entry) {
      res.status(404).json({ error: 'Shortcode does not exist' });
  } else {
      if (new Date() > entry.expiryTime) {
        res.status(410).json({ error: 'Shortcode expired' });
      }

      const referrer = req.get("Referer") || "direct";
      const newClick = {
        timestamp: new Date().toISOString(),
        referrer,
        location: getCoarseLocation(req.ip),
      };
      
    // Get existing clicks
    let existingDetails: any[] = [];
    if (Array.isArray(entry.analytics?.clickDetails)) {
      existingDetails = entry.analytics.clickDetails;
    }

    //update anylytics
    await prisma.analytics.update({
      where: {
        id: entry.analyticsId,
      },
      data: {
        clicks: {
          increment: 1,
        },
        clickDetails: [...existingDetails, newClick],
      },
    });    
    console.log(`Redirected to: ${entry.originalUrl}`);
    res.redirect(entry.originalUrl);
  }

});

export default router;


function getCoarseLocation(ip: string | undefined) {
  throw new Error("Function not implemented.");
}

