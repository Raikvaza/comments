type CommentType = {
  id: number;
  parentID: number | null; // This will be `null` for top-level comments
  author: string;
  text: string;
  children: CommentType[]; // Recursive: A comment can have child comments
};
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
type AddCommentPayload = {
  parentID: number | null; // `null` for top-level comments
  author: string;
  text: string;
};

type ReplyEventPayload = {
  parentCommentId: number;
};

type ReplyFormProps = ReplyEventPayload & {
  onReply: (payload: CommentType) => void;
  closeForm: () => void;
};
type DeleteEventPayload = {
  commentId: number;
};

type CommentListState = {
  comments: CommentType[];
  isLoading: boolean;
  error: string | null;
};
type CommentProps = {
  comment: CommentType;
  onReply: (payload: ReplyEventPayload) => void;
  onDelete: (payload: DeleteEventPayload) => void;
};

type ToggleProviderProps = {
  children: React.ReactNode;
};
type ToggleContextType = {
  toggle: boolean;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
};
export type {
  CommentType,
  ToggleContextType,
  ToggleProviderProps,
  ApiResponse,
  AddCommentPayload,
  ReplyEventPayload,
  ReplyFormProps,
  DeleteEventPayload,
  CommentListState,
  CommentProps,
};
