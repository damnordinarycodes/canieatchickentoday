import mongoose from "mongoose";

let memoryServer;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB at", uri);
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("MONGODB_URI is not set. Refusing to start an in-memory database in production.");
  }

  // No URI configured: spin up a real, local, in-memory MongoDB for zero-config dev.
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  memoryServer = await MongoMemoryServer.create();
  const memUri = memoryServer.getUri();
  await mongoose.connect(memUri);
  console.log("No MONGODB_URI set — started an in-memory MongoDB instance for local dev at", memUri);
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}
