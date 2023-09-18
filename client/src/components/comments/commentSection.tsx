import { useState, useEffect } from "react";
import { CommentType, DeleteEventPayload } from "../../types/types";
import Comment from "./comment";
import { deleteComment, fetchComments } from "../../services/api";
import Spinner from "../spinner/spinner";
import { useToggle } from "../provider/toggleContext";
function CommentSection() {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toggle } = useToggle(); // Access the toggle state from the context
  useEffect(() => {
    async function loadComments() {
      try {
        const fetchedComments = await fetchComments();
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [toggle]);

  const handleReply = async (payload: CommentType) => {
    try {
      // This is where we convert the ReplyEventPayload to AddCommentPayload
      const newComment = {
        id: payload.id,
        parentID: payload.parentID,
        author: payload.author,
        text: payload.text,
        children: payload.children,
      };
      setComments((prevComments) => addNestedComment(prevComments, newComment));
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };
  const handleDelete = async (payload: DeleteEventPayload) => {
    try {
      await deleteComment(payload.commentId);
      setComments((prevComments) =>
        deleteNestedComment(prevComments, payload.commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading)
    return (
      <div
        className="
          flex
          flex-row
          justify-center
          items-center
        "
      >
        <Spinner />
      </div>
    );

  return (
    <div
      className="
            flex
            flex-col
            gap-5
            overflow-auto
        "
    >
      {comments &&
        comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onDelete={handleDelete}
          />
        ))}
    </div>
  );
}

export default CommentSection;

const addNestedComment = (
  comments: CommentType[],
  newComment: CommentType
): CommentType[] => {
  return comments.map((comment) => {
    // If the current comment's ID matches the new comment's parent ID, then add it to the children array
    if (comment.id === newComment.parentID) {
      return {
        ...comment,
        children: [...(comment.children || []), newComment],
      };
    }

    // If not, and if the current comment has children, try to add the new comment to them
    if (comment.children) {
      return {
        ...comment,
        children: addNestedComment(comment.children, newComment),
      };
    }

    return comment; // If neither condition is met, return the comment unchanged
  });
};

const deleteNestedComment = (
  comments: CommentType[],
  targetId: number
): CommentType[] => {
  return comments
    .filter((comment) => comment.id !== targetId) // Remove the comment if its ID matches the target
    .map((comment) => {
      if (comment.children) {
        return {
          ...comment,
          children: deleteNestedComment(comment.children, targetId),
        };
      }
      return comment;
    });
};
