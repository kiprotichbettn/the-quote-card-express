"use strict";

const express = require("express");
const app = express();
const port = 8080;

require("dotenv").config();
const cors = require("cors");


const corsOptions = {
    origin: `http://localhost:${port}`
};
app.use(cors(corsOptions));

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



async function getRandomImage() {
    const endpoint = `https://api.unsplash.com/photos/random/?client_id=${process.env.CLIENT_ID}`;
    try {
        const response = await fetch(endpoint);
        const returnedData = await response.json();

        const receivedPhotoUrl = returnedData?.urls?.regular;

        if (!receivedPhotoUrl) {
            throw new Error("No image URL received");
        }

        return receivedPhotoUrl;
    } catch (error) {
        console.error("Error fetching image:", error.message);
        return null;
    }
}


app.use("/api/v1/getRandomImage", async (req, res) => {
    const imageUrl = await getRandomImage();

    if (imageUrl) {
        res.status(200).json({
            status: 200,
            data: imageUrl
        });
    } else {
        res.status(500).json({
            status: 500,
            error: "Failed to fetch image"
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
