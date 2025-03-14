export const errorHandler = (message = 'Error', statusCode = 500) => {
  return new Response(JSON.stringify({ success: false, message }), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const successHandler = (message = 'Success', data = {}, statusCode = 200) => {
  return new Response(JSON.stringify({ success: true, message, data }), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
};
