package struct_errors

import "reflect"

type NotFoundError CustomError

func (nfe NotFoundError) Error() string {
	return nfe.Message
}

func (nfe NotFoundError) Is(target error) bool {
	return reflect.TypeOf(nfe) == reflect.TypeOf(target)
}
