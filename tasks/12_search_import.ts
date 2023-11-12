import OpenAI from "openai";
import { QdrantClient } from "@qdrant/js-client-rest";

import { debug } from "../lib/debug";
import { randomUUID } from "crypto";

const COLLECTION_NAME = "unknow_news";
const SIZE = 300;
const CHUNK_SIZE = 10;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });

const result = await qdrant.getCollections();
const indexed = result.collections.find(
  (collection) => collection.name === COLLECTION_NAME
);
debug(result);
// Create collection if not exists
if (indexed && process.env.FORCE) {
  await qdrant.deleteCollection(COLLECTION_NAME);
}
if (!indexed || process.env.FORCE) {
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: 1536, distance: "Cosine", on_disk: true },
  });
}
const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);

if (collectionInfo.points_count) {
  debug("COLLECTION ALREADY IMPORTED");
  process.exit(0);
}

type Link = {
  title: string;
  url: string;
  info: string;
  date: string;
};

const links: Link[] = await fetch("https://unknow.news/archiwum.json").then(
  (response) => response.json()
);

const chunks = (<T>(items: T[], size: number, chunkSize: number) => {
  const ret = [];

  for (let i = 0; i < size; i += chunkSize) {
    ret.push(items.slice(i, i + chunkSize));
  }

  return ret;
})(links, SIZE, CHUNK_SIZE);

debug("CHUNKS", chunks);

for (let chunkNr = 0; chunkNr < chunks.length; chunkNr += 1) {
  debug(`Processing chunk ${chunkNr}`);
  const chunk = chunks[chunkNr];

  const embeddings = (
    await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: chunk.map((c) => `${c.title} / ${c.info}`),
    })
  ).data;

  // debug("Embeddings", embeddings);

  debug(
    "qdrant response",
    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points: chunk.map((item, idx) => ({
        id: randomUUID(),
        vector: embeddings[idx].embedding,
        payload: { url: item.url },
      })),
    })
  );
}
