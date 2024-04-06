import { Router } from "express";
import { signUpUser, loginUser } from "../controllers/authControllers";
import { verifyToken } from "../utils/jwtAuth";

const router = Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/protector", verifyToken);

export { router };