const db = require("../config/db");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

exports.getAllQuestions = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      difficulty,
      topicId,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    page = Math.max(1, parseInt(page));
    limit = Math.max(1, parseInt(limit));
    const offset = (page - 1) * limit;

    let queryText = `
       FROM "question_bank" q
      JOIN "topic" t ON t."topicId" = q."topicId"
      WHERE 1=1  
    `;

    const queryParams = [];

    //Search by name
    if (search) {
      queryParams.push(`%${search}%`);
      queryText += ` AND (q."questionName" ILIKE $${queryParams.length} OR t."topicName" ILIKE $${queryParams.length})`;
    }

    //filter by topicId
    if (topicId) {
      queryParams.push(topicId);
      queryText += ` AND q."topicId" = $${queryParams.length}`;
    }

    //filter by difficulty
    if (difficulty) {
      queryParams.push(difficulty);
      queryText += ` AND q."difficulty" = $${queryParams.length}`;
    }
    // to have total count of filter and search
    const totalCount = await db.query(
      `SELECT count(*) ${queryText}`,
      queryParams,
    );
    const totalItems = parseInt(totalCount.rows[0].count);

    const validSortingColumns = ["questionName", "difficulty", "createdAt"];
    const finalSortBy = validSortingColumns.includes(sortBy)
      ? sortBy
      : "createdAt";
    const finalSortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    queryText += ` ORDER BY q."${finalSortBy}" ${finalSortOrder}`;

    queryParams.push(limit, offset);
    queryText += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

    const result = await db.query(
      `SELECT q.*, t."topicName" ${queryText}`,
      queryParams,
    );

    res.json({
      status: "success",
      data: result.rows,
      pagination: {
        totalItems,
        currentPage: page,
        pageSize: limit,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (err) {
    console.log("Error fetching questions", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getQuestionById = async (req, res) => {
  const questionId = req.params.questionId;

  if (!questionId) {
    return res.status(400).json({ error: "questionId is required" });
  }

  // Legacy history rows may reference non-UUID ids (e.g. "q-pair", "Q-0001")
  // from an older schema. Treat them as "not found" rather than letting
  // Postgres throw invalid-uuid-syntax and surfacing a 500 to the caller.
  if (!UUID_REGEX.test(questionId)) {
    return res.status(404).json({ error: "Question not found" });
  }

  try {
    const result = await db.query(
      `SELECT q.*, t."topicName"
       FROM "question_bank" q
       JOIN "topic" t ON t."topicId" = q."topicId"
       WHERE q."questionId" = $1`,
      [questionId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    return res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (err) {
    console.log("Error fetching question ID", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.addQuestion = async (req, res) => {
  const {
    questionName,
    topicId,
    difficulty,
    description,
    publicTestCase,
    privateTestCase,
  } = req.body;

  const createdBy = req.user?.userId || "a0000000-0000-0000-0000-000000000001";

  try {
    const query = `
      INSERT INTO "question_bank"
      ("questionName", "topicId", "difficulty", "description", "publicTestCase", "privateTestCase", "createdBy")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      questionName,
      topicId,
      difficulty,
      description,
      JSON.stringify(publicTestCase),
      JSON.stringify(privateTestCase),
      createdBy,
    ];
    const result = await db.query(query, values);

    res.status(201).json({
      message: "Question created successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating question:", err);

    // Handle unique constraint violation (e.g., duplicate question name)
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ error: "A question with this name already exists" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const {
    questionName,
    topicId,
    difficulty,
    description,
    publicTestCase,
    privateTestCase,
  } = req.body;

  const modifiedBy = req.user?.userId || "a0000000-0000-0000-0000-000000000001";

  if (!questionId) {
    return res.status(400).json({ error: "questionId is required" });
  }

  try {
    // Check question exists first
    const existing = await db.query(
      `SELECT "questionId" FROM "question_bank" WHERE "questionId" = $1`,
      [questionId],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const result = await db.query(
      `UPDATE "question_bank"
       SET
         "questionName"    = COALESCE($1, "questionName"),
         "topicId"         = COALESCE($2, "topicId"),
         "difficulty"      = COALESCE($3, "difficulty"),
         "description"     = COALESCE($4, "description"),
         "publicTestCase"  = COALESCE($5, "publicTestCase"),
         "privateTestCase" = COALESCE($6, "privateTestCase"),
         "modifiedAt"      = NOW(),
         "modifiedBy"      = $7
       WHERE "questionId" = $8
       RETURNING *`,
      [
        questionName || null,
        topicId || null,
        difficulty || null,
        description || null,
        publicTestCase ? JSON.stringify(publicTestCase) : null,
        privateTestCase ? JSON.stringify(privateTestCase) : null,
        modifiedBy,
        questionId,
      ],
    );

    return res.status(200).json({
      message: "Question updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating question:", err);
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ error: "A question with this name already exists" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { questionId } = req.params;

  if (!questionId) {
    return res.status(400).json({ error: "questionId is required" });
  }

  try {
    const result = await db.query(
      `DELETE FROM "question_bank"
       WHERE "questionId" = $1
       RETURNING "questionId", "questionName"`,
      [questionId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Cascade delete to user-service question_history
    try {
      const axios = require("axios");
      await axios.delete(
        `${process.env.USER_SERVICE_URL}/api/question_history/by-question/${questionId}`,
        {
          headers: {
            "X-Service-Secret": process.env.SERVICE_SECRET,
          },
        },
      );
    } catch (cascadeErr) {
      // Log but don't fail the request — question is already deleted
      console.warn(
        "Warning: Could not cascade delete question history:",
        cascadeErr.message,
      );
    }

    return res.status(200).json({
      message: `Question "${result.rows[0].questionName}" deleted successfully`,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error deleting question:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.selectQuestion = async (req, res) => {
  const { topicId, difficulty, exclude = [] } = req.body;

  if (!topicId || !difficulty) {
    return res
      .status(400)
      .json({ error: "topicId and difficulty are required" });
  }

  try {
    let result;
    let usedFallback = false;

    // Try to find a question not in the exclude list
    if (exclude.length > 0) {
      const excludePlaceholders = exclude.map((_, i) => `$${i + 3}`).join(", ");
      result = await db.query(
        `SELECT q.*, t."topicName"
         FROM "question_bank" q
         JOIN "topic" t ON t."topicId" = q."topicId"
         WHERE q."topicId" = $1
           AND q."difficulty" = $2
           AND q."questionId"::text NOT IN (${excludePlaceholders})
         ORDER BY RANDOM()
         LIMIT 1`,
        [topicId, difficulty, ...exclude],
      );

      // Fallback: no questions left after exclusion
      if (result.rows.length === 0) {
        usedFallback = true;
        result = await db.query(
          `SELECT q.*, t."topicName"
           FROM "question_bank" q
           JOIN "topic" t ON t."topicId" = q."topicId"
           WHERE q."topicId" = $1
             AND q."difficulty" = $2
           ORDER BY RANDOM()
           LIMIT 1`,
          [topicId, difficulty],
        );
      }
    } else {
      // No exclude list, just get a random question
      result = await db.query(
        `SELECT q.*, t."topicName"
         FROM "question_bank" q
         JOIN "topic" t ON t."topicId" = q."topicId"
         WHERE q."topicId" = $1
           AND q."difficulty" = $2
         ORDER BY RANDOM()
         LIMIT 1`,
        [topicId, difficulty],
      );
    }

    // topic + difficulty combo doesn't exist
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "No questions found for the given topic and difficulty",
      });
    }

    return res.status(200).json({
      status: "success",
      fallback: usedFallback,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error selecting question:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
