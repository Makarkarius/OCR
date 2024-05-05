class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

function extractErrorMessage(response) {
  const errors = response.data?.errors
  if (!errors || errors.length === 0) {
    return
  }
  return errors[0]?.message
}

function handleApiError(err) {
  if (err.response) {
    if (err.response.status === 401) {
      throw new UnauthorizedError('unauthorized')
    }

    const message = extractErrorMessage(err.response)
    if (message) {
      throw new Error(err.response.data?.errors[0]?.message)
    }
  }
}

export {
  ValidationError,
  UnauthorizedError,
  handleApiError
}
