export default (req, res, next) => {
  const keys = Object.keys(req.body);
  req.body.json = JSON.parse(keys[0]);
  next();
};
