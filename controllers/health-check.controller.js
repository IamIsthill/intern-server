export const healthCheckController = (_req, res, _next) => {
  const startTime = process.hrtime();
  const endTime = process.hrtime(startTime);
  const responseTimeMs = endTime[0] * 1000 + endTime[1] / 1000000;

  const healthcheck = {
    uptime: process.uptime(),
    hrtime: process.hrtime(),
    responseTime: responseTimeMs,
    memoryUsage: process.memoryUsage(),
    message: "OK",
    timestamp: new Date().toISOString(),
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
};
