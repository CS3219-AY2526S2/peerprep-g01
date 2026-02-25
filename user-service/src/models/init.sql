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
    "isUsed" BOOLEAN DEFAULT FALSE, -- To prevent re-using an invite
    "expiresAt" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '48 hours'), -- Security!
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
-- SAMPLE DATA (Users)
-- -----------------------------------------------------------------------------
INSERT INTO "user" ("userId", "userName", "email", "role", "passwordHash") VALUES
    ('a0000000-0000-0000-0000-000000000001', 'SuperAdmin', 'superadmin@peerprep.com', '3', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('a0000000-0000-0000-0000-000000000002', 'AdminAlice', 'admin.alice@peerprep.com', '2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('a0000000-0000-0000-0000-000000000003', 'AdminBob', 'admin.bob@peerprep.com', '2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('b0000000-0000-0000-0000-000000000001', 'Alice', 'alice@peerprep.com', '1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('b0000000-0000-0000-0000-000000000002', 'Bob', 'bob@peerprep.com', '1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT ("email") DO NOTHING;

-- -----------------------------------------------------------------------------
-- SAMPLE DATA (Admin Authorisation)
-- -----------------------------------------------------------------------------
INSERT INTO "admin_authorisation" ("email", "userId", "invited_by", "isUsed", "expiresAt") VALUES
    -- Already Registered: isUsed is TRUE, userId is linked
    ('admin.alice@peerprep.com', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', TRUE, NOW() + INTERVAL '48 hours'),
    ('admin.bob@peerprep.com', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', TRUE, NOW() + INTERVAL '48 hours'),
    
    -- Pending Invite: isUsed is FALSE, userId is NULL
    ('futureadmin@peerprep.com', NULL, 'a0000000-0000-0000-0000-000000000001', FALSE, NOW() + INTERVAL '48 hours'),
    
    -- Expired Invite (for testing your logic later):
    ('expiredadmin@peerprep.com', NULL, 'a0000000-0000-0000-0000-000000000001', FALSE, NOW() - INTERVAL '1 hour')
ON CONFLICT ("email") DO NOTHING;

-- -----------------------------------------------------------------------------
-- SAMPLE DATA (Question History)
-- -----------------------------------------------------------------------------
INSERT INTO "question_history" ("userId", "questionId", "attemptStatus", "partnerId", "sessionEndAt") VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Q-0001', 'completed', 'b0000000-0000-0000-0000-000000000002', NOW()),
    ('b0000000-0000-0000-0000-000000000001', 'Q-0002', 'completed', NULL, NOW()),
    ('b0000000-0000-0000-0000-000000000002', 'Q-0001', 'completed', 'b0000000-0000-0000-0000-000000000001', NOW())
ON CONFLICT DO NOTHING;