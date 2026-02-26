-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
CREATE TYPE "Difficulty" AS ENUM ('Easy', 'Medium', 'Hard');

-- -----------------------------------------------------------------------------
-- TABLES
-- -----------------------------------------------------------------------------

-- Topic Table
CREATE TABLE "topic" (
    "topicId" SERIAL PRIMARY KEY,
    "topicName" VARCHAR(100) NOT NULL UNIQUE
);


-- Question table
CREATE TABLE "question_bank" (
    "questionId" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "questionName" VARCHAR(500) NOT NULL UNIQUE,
    "topicId" INTEGER NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "description" TEXT NOT NULL,
    "publicTestCase" JSONB,
    "privateTestCase" JSONB,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID NOT NULL,
    "modifiedAt"TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" UUID,
    CONSTRAINT fk_topic FOREIGN KEY ("topicId") REFERENCES "topic"("topicId") ON DELETE RESTRICT
);


--SAMPLE DATA --

-- 1. SEED TOPICS
INSERT INTO "topic" ("topicName") VALUES 
('Arrays'), 
('Strings'), 
('Linked Lists'), 
('Dynamic Programming'), 
('Graphs'), 
('Sorting'), 
('Trees'), 
('Heap'), 
('Recursion'), 
('Binary Search')
ON CONFLICT ("topicName") DO NOTHING;

-- 2. SEED QUESTIONS
-- Note: 'createdBy' is set to a mock Admin UUID. 
-- Replace 'a0000000-0000-0000-0000-000000000001' with a real userId from your user table if needed.

INSERT INTO "question_bank" 
("questionName", "topicId", "difficulty", "description", "publicTestCase", "privateTestCase", "createdBy") 
VALUES 
-- Arrays
('Two Sum', 1, 'Easy', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 
 '[{"input": "[2,7,11,15], 9", "output": "[0,1]"}]', '[{"input": "[3,3], 6", "output": "[0,1]"}]', 'a0000000-0000-0000-0000-000000000001'),

('Container With Most Water', 1, 'Medium', 'Find two lines that together with the x-axis forms a container, such that the container contains the most water.', 
 '[{"input": "[1,8,6,2,5,4,8,3,7]", "output": "49"}]', '[{"input": "[1,1]", "output": "1"}]', 'a0000000-0000-0000-0000-000000000001'),

('3Sum', 1, 'Medium', 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.', 
 '[{"input": "[-1,0,1,2,-1,-4]", "output": "[[-1,-1,2],[-1,0,1]]"}]', '[{"input": "[0,0,0]", "output": "[[0,0,0]]"}]', 'a0000000-0000-0000-0000-000000000001'),

-- Strings
('Valid Palindrome', 2, 'Easy', 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.', 
 '[{"input": "A man, a plan, a canal: Panama", "output": "true"}]', '[{"input": "race a car", "output": "false"}]', 'a0000000-0000-0000-0000-000000000001'),

('Longest Substring Without Repeating Characters', 2, 'Medium', 'Given a string s, find the length of the longest substring without repeating characters.', 
 '[{"input": "abcabcbb", "output": "3"}]', '[{"input": "bbbbb", "output": "1"}]', 'a0000000-0000-0000-0000-000000000001'),

('Edit Distance', 2, 'Hard', 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.', 
 '[{"input": "horse, ros", "output": "3"}]', '[{"input": "intention, execution", "output": "5"}]', 'a0000000-0000-0000-0000-000000000001'),

-- Dynamic Programming
('Climbing Stairs', 4, 'Easy', 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?', 
 '[{"input": "2", "output": "2"}]', '[{"input": "3", "output": "3"}]', 'a0000000-0000-0000-0000-000000000001'),

('Coin Change', 4, 'Medium', 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.', 
 '[{"input": "[1,2,5], 11", "output": "3"}]', '[{"input": "[2], 3", "output": "-1"}]', 'a0000000-0000-0000-0000-000000000001'),

('Longest Valid Parentheses', 4, 'Hard', 'Given a string containing just the characters ( and ), return the length of the longest valid (well-formed) parentheses substring.', 
 '[{"input": "(()", "output": "2"}]', '[{"input": " )()())", "output": "4"}]', 'a0000000-0000-0000-0000-000000000001'),

-- Graphs
('Clone Graph', 5, 'Medium', 'Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.', 
 '[{"input": "[[2,4],[1,3],[2,4],[1,3]]", "output": "[[2,4],[1,3],[2,4],[1,3]]"}]', '[]', 'a0000000-0000-0000-0000-000000000001'),

('Course Schedule', 5, 'Medium', 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Some courses may have prerequisites.', 
 '[{"input": "2, [[1,0]]", "output": "true"}]', '[{"input": "2, [[1,0],[0,1]]", "output": "false"}]', 'a0000000-0000-0000-0000-000000000001'),

-- Trees
('Maximum Depth of Binary Tree', 7, 'Easy', 'Given the root of a binary tree, return its maximum depth.', 
 '[{"input": "[3,9,20,null,null,15,7]", "output": "3"}]', '[{"input": "[1,null,2]", "output": "2"}]', 'a0000000-0000-0000-0000-000000000001'),

('Binary Tree Maximum Path Sum', 7, 'Hard', 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them.', 
 '[{"input": "[1,2,3]", "output": "6"}]', '[{"input": "[-10,9,20,null,null,15,7]", "output": "42"}]', 'a0000000-0000-0000-0000-000000000001')

ON CONFLICT ("questionName") DO NOTHING;