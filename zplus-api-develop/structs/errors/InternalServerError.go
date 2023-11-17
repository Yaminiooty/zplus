package struct_errors

import "reflect"

type InternalServerError CustomError

func (nfe InternalServerError) Error() string {
	return nfe.Message
}

func (nfe InternalServerError) Is(target error) bool {
	return reflect.TypeOf(nfe) == reflect.TypeOf(target)
}
