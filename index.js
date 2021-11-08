const axios = require("axios");
const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

async function getDoc(url) {
    const base = "https://docs.oracle.com/javase/8/docs/api/";
    const res = await axios.get(base + url);
    return res.data;
}

// Get request for Javadoc
app.get("/api/doc/:url", async (req, res) => {
    try {
        const doc = await getDoc(req.params.url);

        const body = {doc};

        res.json(body);
    } catch (err) {
        res.sendStatus(500);
    }
});

app.use(express.static("public"));

app.listen(port);
console.log("Server running on localhost:" + port);