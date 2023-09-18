import { useState } from "react";
import { addComment } from "../../services/api";
import { ReplyFormProps } from "../../types/types";
const ReplyForm: React.FC<ReplyFormProps> = ({
  parentCommentId: parentID,
  onReply,
  closeForm,
}) => {
  const [author, setAuthor] = useState<string | undefined>();
  const [text, setText] = useState<string | undefined>();

  const handleAuthorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAuthor(e.target.value);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (author && text) {
      try {
        const addedComment = {
          parentID: parentID,
          author: author,
          text: text,
        };
        const response = await addComment(addedComment);
        console.log(response);

        onReply(response);
        closeForm();
        setAuthor("");
        setText("");
      } catch (error) {
        console.error("Failed to upload the comment:", error);
      }
    }
  };
  return (
    // Main Container
    <form
      className="
      h-[240px]
      w-[760px]
        gap-2
      flex
      px-5
      py-2
      border
      border-black
      flex-col
      justify-between
      items-start
    "
    >
      {/* Author input */}
      <div
        className="
        w-[80%]
        flex
        flex-col
        "
      >
        <div>Автор:</div>
        <textarea
          name="message"
          className="
            w-full 
            resize-none
            border
            border-black
          "
          onChange={handleAuthorChange}
          value={author}
        />
      </div>
      {/* Comment input */}
      <div
        className="
          w-[80%]
          flex-1
          flex
          flex-col
        "
      >
        <div>Текст сообщения:</div>
        <textarea
          name="fname"
          className="
            w-full
            resize-none
            h-full
            border
            border-black
          "
          value={text}
          onChange={handleTextChange}
        />
      </div>
      {/* Submit button */}
      <button
        className="
          self-end
          border border-gray-400
          px-4
          py-1
        "
        onClick={handleUpload}
      >
        Отправить
      </button>
    </form>
  );
};

export default ReplyForm;
