package dto

type LoginResponseModel struct {
	Access_token  string `json:"access_token"`
	Refresh_token string `json:"refresh_token"`
}
