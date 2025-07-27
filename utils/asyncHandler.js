import { CustomError } from "./CustomError.js";

export function asyncHandler(fun) {
  return async (req, res, next) => {
    try {
      await fun(req, res, next); 
    } catch (error) {
      console.log("something went wrong in controller: ", req.url);
      return next(new CustomError(error.message, 400));
    }
  };
}
