import express from "express";
const router = express.Router();

router.get("/", () => {
  console.log("first router");
});
router.get("/:room", (req, res) => {
  res.json({ roomId: req.params.room });
});
export default router;
