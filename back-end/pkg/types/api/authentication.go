package api

type SignUpRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	Surname  string `json:"surname"`
}

type UserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
