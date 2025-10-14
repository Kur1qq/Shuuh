import express from "express";
import { createFullOffender, getAllOffenders, printOffenderPDF } from "../controller/offenderController.js";

const router = express.Router();

router.post("/offenders/full", createFullOffender);
router.get("/offenders", getAllOffenders);
router.get("/offenders/:id/pdf", printOffenderPDF);

export default router;
