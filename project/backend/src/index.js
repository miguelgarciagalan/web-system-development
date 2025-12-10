import app from "./app.js";
import initDb from "./db/initDb.js";

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database initialization failed", err);
    process.exit(1);
  });
