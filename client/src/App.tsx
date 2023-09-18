import CommentSection from "./components/comments/commentSection";
import CommentsForm from "./components/forms/commentsForm";
import { ToggleProvider } from "./components/provider/toggleContext";
function App() {
  return (
    <ToggleProvider>
      <div
        className="
          min-h-screen
          flex
          justify-center
      "
      >
        {/* CENTER CONTAINER */}
        <div
          className="
            flex flex-col justify-start items-start gap-10
            lg:border-[2px] 
            lg:border-gray-400
            lg:w-[1024px] 
            overflow-auto
            pt-7  
        "
        >
          {/* HEADER */}
          <div
            className="
              self-center 
              font-mono font-bold text-2xl
          "
          >
            Добавить комментарий
          </div>
          {/* MAIN INPUT FORM */}
          <CommentsForm />
          {/* COMMENTS SECTION */}
          <div
            className="
              w-full
              flex
              flex-col
              pl-10
              pb-10
              gap-5
          "
          >
            <div
              className="
                font-bold
                text-lg
            "
            >
              Комментарии
            </div>
            <CommentSection />
            {/* <ReplyForm /> */}
          </div>
        </div>
      </div>
    </ToggleProvider>
  );
}

export default App;
