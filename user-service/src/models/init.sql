-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
CREATE TYPE "UserRole" AS ENUM ('1', '2', '3');
CREATE TYPE "AttemptStatus" AS ENUM ('completed', 'attempted');

-- -----------------------------------------------------------------------------
-- TABLES
-- -----------------------------------------------------------------------------

-- User table
CREATE TABLE "user" (
    "userId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userName" VARCHAR(64) NOT NULL,
    "email" VARCHAR(200) NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL, -- Marked as (Bcrypt) in ERD
    "role" "UserRole" NOT NULL DEFAULT '1',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" VARCHAR(64)
);

-- Admin authorisation table (Aligned with ERD)
CREATE TABLE "admin_authorisation" (
    "adminId" SERIAL PRIMARY KEY,
    "email" VARCHAR(200) NOT NULL UNIQUE,
    "userId" UUID,                    -- Added per ERD
    "invited_by" UUID,                -- Linked to userId in ERD
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_link FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE SET NULL,
    CONSTRAINT fk_inviter FOREIGN KEY ("invited_by") REFERENCES "user"("userId") ON DELETE SET NULL
);

-- Question history table
CREATE TABLE "question_history" (
    "historyId" SERIAL PRIMARY KEY,
    "userId" UUID NOT NULL,
    "questionId" VARCHAR(255),
    "attemptStatus" "AttemptStatus",
    "partnerId" UUID,
    "sessionEndAt" TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- SAMPLE DATA
-- -----------------------------------------------------------------------------

-- Users
INSERT INTO "user" ("userId", "userName", "email", "role", "passwordHash") VALUES
    ('a0000000-0000-0000-0000-000000000001', 'SuperAdmin', 'superadmin@peerprep.com', '3', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('a0000000-0000-0000-0000-000000000002', 'AdminAlice', 'admin.alice@peerprep.com', '2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('a0000000-0000-0000-0000-000000000003', 'AdminBob', 'admin.bob@peerprep.com', '2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('b0000000-0000-0000-0000-000000000001', 'Alice', 'alice@peerprep.com', '1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('b0000000-0000-0000-0000-000000000002', 'Bob', 'bob@peerprep.com', '1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Admin Authorisation (Matching ERD: linking the Email to the created UserId)
INSERT INTO "admin_authorisation" ("email", "userId", "invited_by") VALUES
    ('admin.alice@peerprep.com', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001'),
    ('admin.bob@peerprep.com', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001'),
    ('futureadmin@peerprep.com', NULL, 'a0000000-0000-0000-0000-000000000001');

-- Question History (Added topic and difficulty to match schema)
INSERT INTO "question_history" ("userId", "questionId", "attemptStatus", "partnerId", "sessionEndAt") VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Q-0001', 'completed', 'b0000000-0000-0000-0000-000000000002', NOW()),
    ('b0000000-0000-0000-0000-000000000001', 'Q-0002', 'completed', NULL, NOW()),
    ('b0000000-0000-0000-0000-000000000002', 'Q-0001', 'completed', 'b0000000-0000-0000-0000-000000000001', NOW());