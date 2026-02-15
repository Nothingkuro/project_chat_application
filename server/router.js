const express = require("express");
const { getSupabaseClient } = require("./supabaseClient");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ response: "Server is up and running." });
});

router.get("/api/health", async (req, res) => {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return res.status(500).json({ status: "error", error: "Supabase is not configured." });
  }

  try {
    const { data, error } = await supabase
      .from("healthcheck")
      .select("id")
      .limit(1);

    if (error) {
      return res.status(502).json({ status: "error", error: "Supabase query failed." });
    }

    return res.status(200).json({ status: "ok", dataCount: data.length });
  } catch (err) {
    return res.status(502).json({ status: "error", error: "Supabase query failed." });
  }
});

router.get("/api/rooms/:room/messages", async (req, res) => {
  const supabase = getSupabaseClient();
  const roomName = (req.params.room || "").trim().toLowerCase();

  if (!supabase) {
    return res.status(500).json({ status: "error", error: "Supabase is not configured." });
  }

  if (!roomName) {
    return res.status(400).json({ error: "Room is required." });
  }

  try {
    const { data, error } = await supabase
      .from("messages")
      .select("id, room, user, text, created_at")
      .eq("room", roomName)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      return res.status(502).json({ status: "error", error: "Supabase query failed." });
    }

    if (!data.length) {
      return res.status(404).json({ error: "No messages found." });
    }

    return res.status(200).json({ room: roomName, messages: data });
  } catch (err) {
    return res.status(502).json({ status: "error", error: "Supabase query failed." });
  }
});

module.exports = router;