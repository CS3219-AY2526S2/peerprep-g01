const db = require('../config/db');

exports.getAllQuestions = async (req, res) => {
  try{
    let{
      page = 1,
      limit = 10,
      search = '',
      difficulty,
      topicId,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    page = Math.max(1, parseInt(page));
    limit = Math.max(1, parseInt(limit));
    const offset = (page - 1) * limit;

  
    let queryText = `
       FROM "question_bank" q
      JOIN "topic" t ON t."topicId" = q."topicId"
      WHERE 1=1  
    `;

    const queryParams = []

    //Search by name
    if(search) {
      queryParams.push(`%${search}%`);
      queryText += ` AND (q."questionName" ILIKE $${queryParams.length} OR t."topicName" ILIKE $${queryParams.length})`;
    }

    //filter by topicId
    if(topicId) {
      queryParams.push(topicId);
      queryText += ` AND q."topicId" = $${queryParams.length}`;
    }

    //filter by difficulty
    if(difficulty) {
      queryParams.push(difficulty);
      queryText += ` AND q."difficulty" = $${queryParams.length}`;
    }
    // to have total count of filter and search
    const totalCount = await db.query(`SELECT count(*) ${queryText}`, queryParams);
    const totalItems = parseInt(totalCount.rows[0].count);

    const validSortingColumns = ['questionName', 'difficulty', 'createdAt'];
    const finalSortBy = validSortingColumns.includes(sortBy) ? sortBy : 'createdAt'
    const finalSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    queryText += ` ORDER BY q."${finalSortBy}" ${finalSortOrder}`;

    queryParams.push(limit, offset);
    queryText += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

    const result = await db.query(`SELECT q.*, t."topicName" ${queryText}`, queryParams);

    res.json({
      status: "success",
      data: result.rows,
      pagination: {
        totalItems,
        currentPage: page,
        pageSize: limit,
        totalpages: Math.ceil(totalItems / limit)
      }
    });
  } catch (err) {
    console.log("Error fetching questions", err);
    res.status(500).json({error: "Internal Server Error"});
  }
};

exports.getQuestionById = async (req, res) => {
  const questionId = req.params.questionId

  if (!questionId) {
    return res.status(400).json({ error: "questionId is required" });
  }

  try {
    const result = await db.query(
      `SELECT q.*, t."topicName"
       FROM "question_bank" q
       JOIN "topic" t ON t."topicId" = q."topicId"
       WHERE q."questionId" = $1`,
      [questionId]
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

exports.addQuestion = async(req, res) => {
  const {questionName, topicId, difficulty, description, publicTestCase, privateTestCase} = req.body;
     
};
