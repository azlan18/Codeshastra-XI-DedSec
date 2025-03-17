// File: routes/tickets.js
const express = require("express");
const PriorityQueue = require("priorityqueuejs");
const router = express.Router();

// Store tickets using PriorityQueue (higher score = higher priority)
const ticketQueue = new PriorityQueue((a, b) => b.priorityScore - a.priorityScore);

// Sample hardcoded tickets
const sampleTickets = [
  {
    _id: "67d71c33cc985bdc889b327f",
    ticketId: "TICKET-1742150707311",
    customerId: "67d700f7d861829c1b34d9af",
    issueDescription: "You can cut, you can't do it, you can't do it, you can't do it.",
    domain: "Retail Banking & Customer Support",
    priorityScore: 8.5,
    status: "Completed",
    attachedFileId: "2025-03-16T18-45-01-793Z_71d95b0e.wav",
    assignedEmployees: ["John Doe"],
    createdAt: "2025-03-16T18:45:07.322+00:00",
    updatedAt: "2025-03-17T07:20:35.107+00:00",
    closedAt: "2025-03-17T07:20:23.048+00:00",
    customerFeedback: "Great service, resolved my issue quickly!",
    summaryOfWork: "Refunded the missing amount after verifying transaction logs.",
    customerRating: 4,
  },
  {
    _id: "67d71c33cc985bdc889b3280",
    ticketId: "TICKET-1742150807312",
    customerId: "67d700f7d861829c1b34d9b0",
    issueDescription: "Payment failed but amount deducted.",
    domain: "Payments & Transactions",
    priorityScore: 9.2,
    status: "In Progress",
    attachedFileId: "2025-03-16T19-00-01-793Z_91d95b1e.mp3",
    assignedEmployees: ["Jane Smith"],
    createdAt: "2025-03-16T19:00:07.322+00:00",
    updatedAt: "2025-03-17T08:00:35.107+00:00",
    closedAt: null,
    customerFeedback: null,
    summaryOfWork: null,
    customerRating: null,
  },
  {
    _id: "67d71c33cc985bdc889b3281",
    ticketId: "TICKET-1742150907313",
    customerId: "67d700f7d861829c1b34d9b1",
    issueDescription: "Loan application stuck at verification stage.",
    domain: "Loan & Credit",
    priorityScore: 7.8,
    status: "Open",
    attachedFileId: null,
    assignedEmployees: ["Alice Johnson"],
    createdAt: "2025-03-16T19:15:07.322+00:00",
    updatedAt: "2025-03-17T08:30:35.107+00:00",
    closedAt: null,
    customerFeedback: null,
    summaryOfWork: null,
    customerRating: null,
  },
];

// Add tickets to the priority queue
sampleTickets.forEach((ticket) => ticketQueue.enq(ticket));

// API to Get High-Priority Tickets
router.get("/", (req, res) => {
  if (ticketQueue.isEmpty()) {
    return res.json({ message: "No tickets available" });
  }

  const topTickets = [];
  const tempQueue = new PriorityQueue((a, b) => b.priorityScore - a.priorityScore);

  while (!ticketQueue.isEmpty()) {
    const ticket = ticketQueue.deq();
    topTickets.push(ticket);
    tempQueue.enq(ticket);
  }

  while (!tempQueue.isEmpty()) {
    ticketQueue.enq(tempQueue.deq());
  }

  res.json({ topTickets });
});

module.exports = router;