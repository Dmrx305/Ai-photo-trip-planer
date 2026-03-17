import cors from "cors";
import express from "express";
import { ZodError } from "zod";
import { createTripPlan } from "./planner";

const app = express();
const port = Number(process.env.SERVER_PORT ?? 8787);
const host = process.env.SERVER_HOST ?? "127.0.0.1";

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true
  });
});

app.post("/api/plan-trip", async (request, response) => {
  try {
    const plan = await createTripPlan(request.body);
    response.json(plan);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).send("Ungueltige Eingabedaten.");
      return;
    }

    const message =
      error instanceof Error ? error.message : "Unbekannter Serverfehler.";
    response.status(500).send(message);
  }
});

app.listen(port, host, () => {
  console.log(`AI Photo Trip Planner server listening on http://${host}:${port}`);
});
