# Resource Management Feature

The resource management system allows users to view, like, rate, and interact with learning resources in the platform.

## API Endpoints

### Get Resources
```http
GET /api/resources
```

Query parameters:
- `subject` (optional): Filter by subject
- `type` (optional): Filter by resource type (video, document, quiz, interactive)
- `difficulty` (optional): Filter by difficulty (beginner, intermediate, advanced)
- `sort` (optional): Sort field (default: -createdAt)
- `search` (optional): Text search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### Get Single Resource
```http
GET /api/resources/:id
```

### Toggle Like
```http
POST /api/resources/:id/toggle-like
```
Requires authentication. Toggles the like status for the current user.

### Rate Resource
```http
POST /api/resources/:id/rate
```
Requires authentication.

Request body:
```json
{
  "rating": 5,
  "review": "Optional review comment"
}
```

### Increment View Count
```http
POST /api/resources/:id/increment-view
```
Increments the view count for the resource.

## Running the Feature

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access the resources page at:
   ```
   http://localhost:5173/resources
   ```

3. View individual resources at:
   ```
   http://localhost:5173/resources/:id
   ```

## Running Tests

```bash
cd server
npm test
```

This will run the test suite including resource controller tests.

## Implementation Details

### Frontend
- Uses React Query for data fetching and caching
- Real-time updates for likes and ratings
- Responsive design with Tailwind CSS
- Custom hooks for resource interactions

### Backend
- MongoDB schema with Mongoose
- Efficient pagination and filtering
- Real-time updates via Socket.IO
- Authentication middleware for protected actions