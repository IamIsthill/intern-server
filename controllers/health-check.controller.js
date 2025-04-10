export const healthCheckController = (_req, res, _next) => {
  const healthcheck = {
    uptime: process.uptime(),
    responsetime: process.hrtime(),
    memoryUsage: process.memoryUsage(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
};
