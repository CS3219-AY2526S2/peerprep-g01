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

    queryParams = []

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

// exports.getQuestionById = async (req, res) => {
// };
