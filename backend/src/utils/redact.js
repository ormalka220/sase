function redact(value) {
  if (!value) return value
  const str = typeof value === 'string' ? value : JSON.stringify(value)
  return str
    .replace(/"token"\s*:\s*"[^"]+"/gi, '"token":"[REDACTED]"')
    .replace(/"authorization"\s*:\s*"[^"]+"/gi, '"authorization":"[REDACTED]"')
}

module.exports = { redact }
