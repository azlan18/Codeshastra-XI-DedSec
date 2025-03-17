// File: routes/meet.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// Generate Google Meet Link
router.get("/", async (req, res) => {
  const users = req.app.locals.users;
  const userId = Object.keys(users)[0]; // Assume first user
  const user = users[userId];

  if (!user || !user.accessToken) {
    return res.status(401).json({ error: "❌ User not authenticated or missing access token!" });
  }

  try {
    const event = {
      summary: "Google Meet Meeting",
      description: "This is a test Google Meet meeting.",
      start: {
        dateTime: new Date().toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(new Date().getTime() + 30 * 60000).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: {
          requestId: "meeting-" + new Date().getTime(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await axios.post(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      event,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const meetLink = response.data.conferenceData.entryPoints[0].uri;
    console.log("✅ Google Meet Link:", meetLink);
    res.json({ meetLink });
  } catch (error) {
    console.error("❌ Error creating Google Meet:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create Google Meet" });
  }
});

module.exports = router;