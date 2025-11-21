const express = require('express');
const { queryLLM } = require('../utils/llm');
const Resource = require('../models/Resource');
const { uploadMiddleware, UPLOAD_ROOT } = require('../middleware/uploadMiddleware');
const path = require('path');

// Simple role check helper
function ensureTutor(req, res, next) {
  const role = (req.user && req.user.role || '').toLowerCase();
  if (role !== 'tutor') return res.status(403).json({ message: 'Only tutors can perform this action' });
  next();
}

async function assistant(req, res) {
  try {
    const { userId, role, question, context } = req.body || {};
    if (!userId || !question) return res.status(400).json({ message: 'userId and question required' });

    // Basic sanitization
    if (String(question).length > 5000) return res.status(400).json({ message: 'Question too long' });

    const response = await queryLLM({ userId, role, question, context });
    return res.json(response);
  } catch (err) {
    if (err.code === 'RATE_LIMIT') return res.status(429).json({ message: 'Rate limit exceeded' });
    console.error('Assistant error', err);
    return res.status(500).json({ message: 'Assistant error' });
  }
}

async function uploadResource(req, res) {
  try {
    // file is in req.file
    const file = req.file;
    const { title, subject, tags, summary } = req.body;
    if (!file) return res.status(400).json({ message: 'File required' });

    const resource = new Resource({
      title: title || file.originalname,
      subject,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      summary,
      fileUrl: `/uploads/resources/${file.filename}`,
      filename: file.filename,
      uploadedBy: req.user?._id,
      size: file.size
    });
    await resource.save();
    res.json(resource);
  } catch (err) {
    console.error('uploadResource error', err);
    res.status(500).json({ message: 'Upload failed' });
  }
}

async function listResources(req, res) {
  try {
    const { q, tag, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (tag) filter.tags = tag;
    const skip = (Number(page) - 1) * Number(limit);
    const items = await Resource.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean();
    const total = await Resource.countDocuments(filter);
    res.json({ items, total });
  } catch (err) {
    console.error('listResources error', err);
    res.status(500).json({ message: 'Failed to list' });
  }
}

async function getResource(req, res) {
  try {
    const id = req.params.id;
    const resource = await Resource.findById(id).lean();
    if (!resource) return res.status(404).json({ message: 'Not found' });
    // In production, return signed URL from S3/Cloud storage. For local, return direct path.
    res.json(resource);
  } catch (err) {
    console.error('getResource error', err);
    res.status(500).json({ message: 'Failed to get resource' });
  }
}

async function summarizeResource(req, res) {
  try {
    const id = req.params.id;
    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).json({ message: 'Not found' });
    // For now run mock summarization via queryLLM
    const text = (resource.summary || resource.title || '').slice(0, 2000);
    const summaryRes = await queryLLM({ userId: req.user?._id, question: `Summarize: ${text}` });
    resource.summary = summaryRes.answer || resource.summary;
    await resource.save();
    res.json({ summary: resource.summary });
  } catch (err) {
    console.error('summarizeResource error', err);
    res.status(500).json({ message: 'Summarize failed' });
  }
}

module.exports = {
  assistant,
  uploadResource,
  listResources,
  getResource,
  summarizeResource,
  ensureTutor
};
