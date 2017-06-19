import { Request, Response, NextFunction } from "express";

/** Return an API error with the appropriate level of detail */
export function ErrorDetailHandler(err: any, req: APIRequest, res: APIResponse, next: NextFunction): void {
	let errcode = 500;
	let message = "Unexpected error";
	if (err instanceof Error) {
		ExposeError(err);
		message = err.message;
	}
	if (err instanceof ErrorDetail) {
		errcode = err.code;
		if (!err.detail) {
			err = null;
		}
	}

	res.status(errcode);
	res.message = message;
	res.exception = err;

	const result: any = {
		"status": errcode,
		"message": message,
	};
	res.json(result);
}

/** Error with additional return code and details */
export class ErrorDetail extends Error {
	public code: number;
	public detail: any;

	constructor(code: number, message: string, detail?: any) {
		super(message);
		ExposeError(this);
		ExposeError(detail);
		this.code = code;
		this.detail = detail;
	}
}

/** Default Errors have non-enumerable properties, let's expose them */
export function ExposeError(error: any): void {
	try {
		if (error) {
			if (error.message) {
				Object.defineProperty(error, "message", {
					enumerable: true
				});
			}
			if (error.stack) {
				Object.defineProperty(error, "stack", {
					enumerable: true
				});
			}
		}
	} catch (err) {
		// Should not be possible
		console.error("Error exposing token");
		console.error(err);
	}
}

/**
 * Wraps an async express route, and properly catches any errors and pushes them up.
 * Async functions return a promise. Express doesn't know how to handle promise errors, so we wrap them in this function
 */
export function RouteWrap(func: ((req: APIRequest, res: APIResponse, next: NextFunction) => Promise<any>)): (req: APIRequest, res: APIResponse, next: NextFunction) => void {
	return (req: APIRequest, res: APIResponse, next: NextFunction) => {
		func(req, res, next).catch(next);
	};
}

export interface APIRequest extends Request {
	_log_startAt?: [number, number];
}
export interface APIResponse extends Response {
	message?: string;
	exception?: any;
}
