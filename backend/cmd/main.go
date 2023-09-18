package main

import (
	"database/sql"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

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

var db *sql.DB

func init() {
	// Setup your database connection here. For simplicity, I'm using SQLite.
	var err error
	db, err = sql.Open("sqlite3", "./comments.db")
	if err != nil {
		log.Fatal(err)
	}

	// Create the comments table if it doesn't exist
	statement, _ := db.Prepare(`
		CREATE TABLE IF NOT EXISTS comments (
			id INTEGER PRIMARY KEY,
			parentID INTEGER,
			author TEXT,
			text TEXT
		);
	`)
	statement.Exec()
}

func main() {
	r := gin.Default()
    // Use the CORS middleware for all routes
    // Here we allow all origins for simplicity, but you can limit to specific origins if desired
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"http://localhost:5173"}
    config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
    config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
    r.Use(cors.New(config))
	
	r.GET("/api/comments", getComments)
	r.POST("/api/comments", addComment)
	r.DELETE("/api/comments/:id", deleteComment)

	r.Run(":8080")
}

func getComments(c *gin.Context) {
	comments := fetchCommentsRecursive(nil)
	c.JSON(200, gin.H{"success": true, "data": comments, "message": "Comments fetched successfully."})
}
func addComment(c *gin.Context) {
	var payload AddCommentPayload
	if err := c.BindJSON(&payload); err != nil {
		c.JSON(400, gin.H{"success": false, "message": "Invalid request payload."})
		return
	}

	statement, _ := db.Prepare("INSERT INTO comments (parentID, author, text) VALUES (?, ?, ?)")
	result, _ := statement.Exec(payload.ParentID, payload.Author, payload.Text)

	lastInsertedId, _ := result.LastInsertId()

	// Now query the database for the newly added comment
	row := db.QueryRow("SELECT id, parentID, author, text FROM comments WHERE id=?", lastInsertedId)

	var comment Comment
	if err := row.Scan(&comment.ID, &comment.ParentID, &comment.Author, &comment.Text); err != nil {
		c.JSON(500, gin.H{"success": false, "message": "Error fetching the newly added comment."})
		return
	}

	c.JSON(200, gin.H{"success": true, "message": "Comment added successfully.", "data": comment})
}


func deleteComment(c *gin.Context) {
	commentId := c.Param("id")

	statement, _ := db.Prepare("DELETE FROM comments WHERE id = ?")
	statement.Exec(commentId)

	c.JSON(200, gin.H{"success": true, "message": "Comment deleted successfully."})
}

func fetchCommentsRecursive(parentID *int64) []Comment {
	var rows *sql.Rows
	var err error
	
	if parentID == nil {
		rows, err = db.Query("SELECT id, parentID, author, text FROM comments WHERE parentID IS NULL")
	} else {
		rows, err = db.Query("SELECT id, parentID, author, text FROM comments WHERE parentID=?", parentID)
	}

	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var comments []Comment
	for rows.Next() {
		var comment Comment
		if err := rows.Scan(&comment.ID, &comment.ParentID, &comment.Author, &comment.Text); err != nil {
			log.Fatal(err)
		}
		// Check if the comment has children before making a recursive call
		if hasChildren(comment.ID) {
			comment.Children = fetchCommentsRecursive(&comment.ID)
		}		
		
		comments = append(comments, comment)
	}

	return comments
}
// Helper function to check if a comment has children
func hasChildren(commentID int64) bool {
	row := db.QueryRow("SELECT EXISTS(SELECT 1 FROM comments WHERE parentID=?)", commentID)
	var exists bool
	if err := row.Scan(&exists); err != nil {
		log.Fatal(err)
	}
	return exists
}
