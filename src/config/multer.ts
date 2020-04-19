import crypto from "crypto";
import multer from "multer";
import { resolve } from "path";

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "tmp"),
    filename(req, file, cb) {
      const fileHash = crypto.randomBytes(10).toString("HEX");

      const fileName = `${fileHash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};
