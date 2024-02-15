const express = require("express");

const app = express();

app.get("/test", (req, res) => {
  return res.send("Work");
});

app.listen(process.env.PORT || 3001);
