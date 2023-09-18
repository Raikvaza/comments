import { useState } from "react";
import { addComment } from "../../services/api";
import { useToggle } from "../provider/toggleContext";
const CommentsForm: React.FC = () => {
  const [author, setAuthor] = useState<string | undefined>();
  const [text, setText] = useState<string | undefined>();
  const { toggle, setToggle } = useToggle();

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
        await addComment({
          parentID: null,
          author: author,
          text: text,
        });
        setAuthor("");
        setText("");
        setToggle(!toggle);
      } catch (error) {
        console.error("Failed to upload the comment:", error);
      }
    }
  };

  return (
    // Main Container
    <div
      className="
        h-[480px]
        w-full
        flex
        pl-5
        flex-col
        border-b-2 border-gray-400
        justify-evenly
        items-start
      "
    >
      {/* Author container */}
      <div
        className="
          w-[80%] 
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
      {/* Text container */}
      <div
        className="
        w-[80%]
      "
      >
        <div>Текст сообщения:</div>
        <textarea
          name="fname"
          className="
          w-full 
          h-52 
          resize-none
          border
          border-black
        "
          onChange={handleTextChange}
          value={text}
        />
      </div>
      {/* Submit Button */}
      <button
        className="
        border
        border-gray-400
        px-4
        py-1
      "
        onClick={handleUpload}
      >
        Отправить
      </button>
    </div>
  );
};

export default CommentsForm;
