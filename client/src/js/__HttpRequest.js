export const httpRequest = async (url, method = 'GET', body = null, token = null) => {
  try {
    body = body ? JSON.stringify(body) : null
    const headers = { 'Content-Type': 'application/json', 
                    ...( token && { Authorization: token } )
                    }
    const response = await fetch(url, {method, body, headers})
    const data = await response.json()
    if (!response.ok) {
      return alert(data.message) 
    }
    return data
  } catch (e) {
    throw e
  }
}
