import mongoose from "mongoose";

// MongoDB URI
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://jzee:miE1SmCVOzC1TgK8@cluster0.k7oqq.mongodb.net/jehangira-marbles?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global cache for Mongoose connection to prevent multiple connections in development.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined; // Use `var` to define global
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

async function dbConnect() {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to prevent memory overload
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw error; // Rethrow error for better error reporting
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.conn = null; // Reset cached connection in case of failure
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
