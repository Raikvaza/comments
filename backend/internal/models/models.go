package models
type Comment struct {
	ID      int64       `json:"id"`
	ParentID *int64     `json:"parentID"` // Using a pointer so it can be null
	Author  string      `json:"author"`
	Text    string      `json:"text"`
	Children []Comment  `json:"children"`
}
type AddCommentPayload struct {
	ParentID *int64  `json:"parentID"`  // This can be null for top-level comments
	Author   string  `json:"author"`
	Text     string  `json:"text"`
}