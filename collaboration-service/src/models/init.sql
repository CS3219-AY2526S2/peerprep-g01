CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "session" (
    "sessionId"  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "roomId"     VARCHAR(100) NOT NULL UNIQUE,
    "questionId" UUID NOT NULL,
    "question"   JSONB,
    "userOneId"  UUID NOT NULL,
    "userTwoId"  UUID NOT NULL,
    "status"     VARCHAR(20) NOT NULL DEFAULT 'active',
    "docState"   BYTEA,
    "createdAt"  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "endedAt"    TIMESTAMP
);

CREATE INDEX idx_session_status ON "session" ("status");
