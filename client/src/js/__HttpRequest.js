function UserException(val, status) {
  this.val = ( typeof val[0] === 'object' )
    ? val
    : [{'msg': val[0]}];
  this.status = status;
}

export const httpRequest = async (url, method = 'GET', body = null, token = null) => {
  try {
    body = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json', 
                    ...( token && { Authorization: token } )
                    };
    const response = await fetch(url, {method, body, headers});
    const data = await response.json();
    if (!response.ok) {
      throw new UserException(Object.values(data), response.status); 
    }
    return data;
  } catch (e) {
    throw e;
  }
}