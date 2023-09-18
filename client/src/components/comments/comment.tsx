import { useState } from "react";
import { CommentType, DeleteEventPayload } from "../../types/types";
import ReplyForm from "../forms/replyForm";

function Comment({
  comment,
  onReply,
  onDelete,
}: {
  comment: CommentType;
  onReply: (payload: CommentType) => void;
  onDelete: (payload: DeleteEventPayload) => void;
}) {
  const [replying, setReplying] = useState(false);

  const handleDeleteClick = () => {
    onDelete({ commentId: comment.id });
  };
  const handleReplyToggle = () => {
    setReplying(!replying);
  };
  return (
    // Main Container
    <div
      style={{
        marginLeft: comment.parentID ? 40 : 0,
      }}
      className="
        flex
        flex-col
        gap-5
      "
    >
      {/* Comment container */}
      <div
        className="
          w-full
          flex
          flex-row
          gap-5
          justify-start
          items-stretch
          min-h-[80px]
        "
      >
        {/* Comment text */}
        <div
          className="
            border
            border-black
            flex
            shrink-0
            basis-[480px]
            flex-col
            justify-center
            items-start
            px-10
        "
        >
          <div>Автор: {comment.author}</div>
          <div>{comment.text}</div>
        </div>
        {/* Delete button */}
        <button
          className="
            border
            border-gray-400
            px-4
            py-1
            self-center
        "
          onClick={handleDeleteClick}
        >
          Удалить
        </button>
        {/* Reply button */}
        <button
          className="
            border
            border-gray-400
            px-4
            py-1
            self-center
        "
          onClick={handleReplyToggle}
        >
          Ответить
        </button>
      </div>
      {replying && (
        <ReplyForm
          parentCommentId={comment.id}
          onReply={onReply}
          closeForm={handleReplyToggle}
        />
      )}
      {comment.children &&
        comment.children.map((child) => (
          <Comment
            key={child.id}
            comment={child}
            onReply={onReply}
            onDelete={onDelete}
          />
        ))}
    </div>
  );
}

export default Comment;
