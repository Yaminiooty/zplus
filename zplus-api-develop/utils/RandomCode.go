package utils

import "math/rand"

func GetRandomSixDigitCode() int {
	min := 100000
	max := 999999
	return rand.Intn(max-min) + min
}
