import express from "express";
import cors from "cors";

import apiFiles from "./api/files";
import apiFields from "./api/fields";
import apiSql from "./api/sql";
import apiTables from "./api/tables";

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 8080;
// eslint-disable-next-line no-undef
const BASE_PATH = process.env.BASE_PATH || "";
const ORIGIN_DEV = "http://localhost:1234";

const app = express();
const router = express.Router();

router.post("/api/files", apiFiles);
router.post("/api/fields", apiFields);
router.post("/api/sql", apiSql);
router.post("/api/tables", apiTables);

// If prod :
router.use("/", express.static("dist"));

// If dev :
// return: This host only the api. UI is available on url ORIGIN_DEV.

const origin = [ORIGIN_DEV];

app.use(cors({ origin }));
app.use(express.json());
app.use(BASE_PATH, router);

app.listen(PORT, () => {
  console.log("Ready\n");
  console.log(`http://localhost:${PORT}${BASE_PATH}/\n`);
});
