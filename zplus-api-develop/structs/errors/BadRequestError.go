package struct_errors

import "reflect"

type BadRequestError CustomError

func (nfe BadRequestError) Error() string {
	return nfe.Message
}

func (nfe BadRequestError) Is(target error) bool {
	return reflect.TypeOf(nfe) == reflect.TypeOf(target)
}
