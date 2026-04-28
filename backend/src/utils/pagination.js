function parsePagination(query, defaults = { page: 1, limit: 20, maxLimit: 100 }) {
  const page = Math.max(1, parseInt(query.page, 10) || defaults.page)
  const limit = Math.min(
    defaults.maxLimit,
    Math.max(1, parseInt(query.limit, 10) || defaults.limit)
  )
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

function paginatedResponse(data, total, { page, limit }) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  }
}

module.exports = { parsePagination, paginatedResponse }
