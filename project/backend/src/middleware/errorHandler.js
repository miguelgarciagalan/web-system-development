const errorHandler = (err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
};

export default errorHandler;
