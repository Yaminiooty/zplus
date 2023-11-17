package struct_errors

import "reflect"

type InvalidJwtTokenError CustomError

func (ijt InvalidJwtTokenError) Error() string {
	return ijt.Message
}

func (ijt InvalidJwtTokenError) Is(target error) bool {
	return reflect.TypeOf(ijt) == reflect.TypeOf(target)
}
