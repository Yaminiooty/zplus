package struct_errors

type CustomError struct {
	Message string `json:"message"`
	Err     error  `json:"error"`
}

func (ce CustomError) Error() string {
	return ce.Message
}
