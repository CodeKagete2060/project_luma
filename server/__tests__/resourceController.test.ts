import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { resourceController } from '../controllers/resourceController';
import Resource from '../models/Resource';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('Resource Controller', () => {
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterEach(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('GET /api/resources', () => {
    test('should return filtered resources with pagination', async () => {
      // Setup test data
      const resources = await Resource.create([
        {
          title: 'Test Resource 1',
          description: 'Description 1',
          subject: 'Math',
          type: 'video',
          url: 'https://example.com/1',
          difficulty: 'beginner',
          createdBy: new mongoose.Types.ObjectId(),
        },
        {
          title: 'Test Resource 2',
          description: 'Description 2',
          subject: 'Science',
          type: 'document',
          url: 'https://example.com/2',
          difficulty: 'intermediate',
          createdBy: new mongoose.Types.ObjectId(),
        },
      ]);

      const req = {
        query: {
          subject: 'Math',
          page: '1',
          limit: '10',
        },
      };

      const res = {
        json: jest.fn(),
      };

      await resourceController.get('/', req as any, res as any);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          resources: expect.arrayContaining([
            expect.objectContaining({
              title: 'Test Resource 1',
              subject: 'Math',
            }),
          ]),
          totalPages: expect.any(Number),
          currentPage: 1,
        })
      );
    });
  });

  describe('POST /api/resources/:id/toggle-like', () => {
    test('should toggle like status for a resource', async () => {
      const userId = new mongoose.Types.ObjectId();
      const resource = await Resource.create({
        title: 'Test Resource',
        description: 'Description',
        subject: 'Math',
        type: 'video',
        url: 'https://example.com',
        difficulty: 'beginner',
        createdBy: new mongoose.Types.ObjectId(),
      });

      const req = {
        params: { id: resource._id.toString() },
        user: { _id: userId },
      };

      const res = {
        json: jest.fn(),
      };

      await resourceController.post('/:id/toggle-like', req as any, res as any);

      const updatedResource = await Resource.findById(resource._id);
      expect(updatedResource?.likedBy).toContain(userId.toString());

      // Toggle like off
      await resourceController.post('/:id/toggle-like', req as any, res as any);
      const finalResource = await Resource.findById(resource._id);
      expect(finalResource?.likedBy).not.toContain(userId.toString());
    });
  });

  describe('POST /api/resources/:id/rate', () => {
    test('should add a rating to a resource', async () => {
      const userId = new mongoose.Types.ObjectId();
      const resource = await Resource.create({
        title: 'Test Resource',
        description: 'Description',
        subject: 'Math',
        type: 'video',
        url: 'https://example.com',
        difficulty: 'beginner',
        createdBy: new mongoose.Types.ObjectId(),
      });

      const req = {
        params: { id: resource._id.toString() },
        user: { _id: userId, firstName: 'Test', lastName: 'User' },
        body: {
          rating: 5,
          review: 'Great resource!',
        },
      };

      const res = {
        json: jest.fn(),
      };

      await resourceController.post('/:id/rate', req as any, res as any);

      const updatedResource = await Resource.findById(resource._id);
      expect(updatedResource?.ratings).toHaveLength(1);
      expect(updatedResource?.ratings[0]).toMatchObject({
        user: userId,
        rating: 5,
        review: 'Great resource!',
      });
      expect(updatedResource?.averageRating).toBe(5);
    });
  });
});