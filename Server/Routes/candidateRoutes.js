const express = require("express");
const router = express.Router();
const upload = require("../config/upload");
const { addCandidate, getAllCandidates, deleteCandidate ,updateCandidateStatus} = require("../Controller/candidateController");

router.post("/add", upload.single("jobOpening"), addCandidate);
router.get("/all", getAllCandidates);
router.delete("/:id", deleteCandidate);
router.put("/:id/status", updateCandidateStatus);
module.exports = router;
