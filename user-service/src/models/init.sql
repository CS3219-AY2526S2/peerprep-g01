-- =============================================================================
-- PeerPrep User Service - Database Initialisation
-- =============================================================================
-- Schema: User (RBAC), Question History, Admin Authorisation
-- Run via: docker-compose (init.sql mounted to postgres /docker-entrypoint-initdb.d/)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
-- Role: 1 → User, 2 → Admin, 3 → Super Admin
CREATE TYPE "UserRole" AS ENUM ('1', '2', '3');
-- Attempt: completed = passed all test cases, attempted = failed/timeout/etc
CREATE TYPE "AttemptStatus" AS ENUM ('completed', 'attempted');

-- -----------------------------------------------------------------------------
-- TABLES
-- -----------------------------------------------------------------------------
-- User table: stores both User and Admin data for RBAC
CREATE TABLE "user" (
    "userId" UUID PRIMARY KEY,
    "userName" VARCHAR(64) NOT NULL,
    "email" VARCHAR(200) NOT NULL UNIQUE,
    "role" "UserRole" NOT NULL DEFAULT '1',
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" VARCHAR(64)
);

-- Question history: 1 (optional) to many per user
-- Used for: past attempts, UI/UX history, question bank selection (match by topic/difficulty)
CREATE TABLE "question_history" (
    "historyId" SERIAL PRIMARY KEY,
    "userId" UUID NOT NULL,
    "questionId" VARCHAR(255),
    "difficulty" VARCHAR(50),
    "topic" VARCHAR(100),
    "attemptStatus" "AttemptStatus",
    "partnerId" UUID,
    "sessionEndAt" TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY ("userId")
        REFERENCES "user"("userId")
        ON DELETE CASCADE
);

-- Admin authorisation: whitelist of emails allowed to sign up as Admin
-- Super Admin adds email → Admin signs up → System checks this table before creating account
CREATE TABLE "admin_authorisation" (
    "Email" VARCHAR(200) PRIMARY KEY,
    "Invited_by" UUID,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inviter
        FOREIGN KEY ("Invited_by")
        REFERENCES "user"("userId")
        ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- SAMPLE DATA
-- -----------------------------------------------------------------------------
-- Test password for all sample users: "password" (change in production!)
-- bcrypt hash (cost 10)

-- Users: 1 Super Admin, 2 Admins, 3 Regular Users
INSERT INTO "user" ("userId", "userName", "email", "role", "passwordHash") VALUES
    ('a0000000-0000-0000-0000-000000000001', 'SuperAdmin', 'superadmin@peerprep.com', '3', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('a0000000-0000-0000-0000-000000000002', 'AdminAlice', 'admin.alice@peerprep.com', '2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('a0000000-0000-0000-0000-000000000003', 'AdminBob', 'admin.bob@peerprep.com', '2', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('b0000000-0000-0000-0000-000000000001', 'Alice', 'alice@peerprep.com', '1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('b0000000-0000-0000-0000-000000000002', 'Bob', 'bob@peerprep.com', '1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('b0000000-0000-0000-0000-000000000003', 'Charlie', 'charlie@peerprep.com', '1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Admin authorisation: emails whitelisted for Admin signup (invited by Super Admin)
-- AdminAlice and AdminBob already have accounts; futureadmin@ is pending signup
INSERT INTO "admin_authorisation" ("Email", "Invited_by") VALUES
    ('admin.alice@peerprep.com', 'a0000000-0000-0000-0000-000000000001'),
    ('admin.bob@peerprep.com', 'a0000000-0000-0000-0000-000000000001'),
    ('futureadmin@peerprep.com', 'a0000000-0000-0000-0000-000000000001');

-- Question history: sample attempts for Alice, Bob, Charlie
-- Used for question bank selection (match by topic/difficulty, exclude both attempted)
INSERT INTO "question_history" ("userId", "questionId", "difficulty", "topic", "attemptStatus", "partnerId", "sessionEndAt") VALUES
    -- Alice: completed 2, attempted 1
    ('b0000000-0000-0000-0000-000000000001', 'two-sum', 'easy', 'Array', 'completed', 'b0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '2 days'),
    ('b0000000-0000-0000-0000-000000000001', 'valid-parentheses', 'easy', 'Stack', 'completed', NULL, NOW() - INTERVAL '5 days'),
    ('b0000000-0000-0000-0000-000000000001', 'reverse-linked-list', 'medium', 'Linked List', 'attempted', NULL, NOW() - INTERVAL '1 day'),
    -- Bob: completed 1, attempted 1 (paired with Alice on two-sum)
    ('b0000000-0000-0000-0000-000000000002', 'two-sum', 'easy', 'Array', 'completed', 'b0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days'),
    ('b0000000-0000-0000-0000-000000000002', 'merge-two-sorted-lists', 'easy', 'Linked List', 'attempted', NULL, NOW() - INTERVAL '3 days'),
    -- Charlie: completed 2
    ('b0000000-0000-0000-0000-000000000003', 'valid-parentheses', 'easy', 'Stack', 'completed', NULL, NOW() - INTERVAL '4 days'),
    ('b0000000-0000-0000-0000-000000000003', 'binary-search', 'easy', 'Binary Search', 'completed', NULL, NOW() - INTERVAL '1 day');