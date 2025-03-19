package api

type SignUpRequest struct {
	Email    string  `json:"email"`
	Password string  `json:"password"`
	Name     *string `json:"name,omitempty"`
	Surname  *string `json:"surname,omitempty"`
}

type UserRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
