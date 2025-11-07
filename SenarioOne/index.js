export const handler = async (event) => {
  const service = process.env.SERVICE_NAME;
  const version = process.env.VERSION_NAME;
  const time = new Date().toISOString();

  console.log(`Health check: s${service} v${version} t ${time}`);

  const response = {
    statusCode: 200,
    body: JSON.stringify({service, version, time}),
  };
  return response;
};