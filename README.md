#AIT Final Project

#Location based social feed.
Think of a social media site like twitter or reddit, but based on your local community.
This project will be pretty similar to yikyak, but instead of joining a pre-determined community like a college campus, you are shown posts based on your immediete area.

I'd like to build in some sort of algorithm that sorts based off of proximietly, date posted, and interactions.

Building site with:
-React
-Tailwild css
-Mongo backend 

## Environment Variables

### Client (React)
Create a `.env` file in the `client/` directory with:
```
VITE_API_URL=https://your-api-server.com
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

For local development, `VITE_API_URL` can be left empty (defaults to `http://localhost:3001`).

### Server (Node.js/Express)
Create a `.env` file in the `server/` directory with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3001
```

<3



