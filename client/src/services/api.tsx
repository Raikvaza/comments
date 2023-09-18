import { ApiResponse, CommentType, AddCommentPayload } from "../types/types";
const BASE_URL = "http://localhost:8080/api";

export async function fetchComments(): Promise<CommentType[]> {
  const response = await fetch(`${BASE_URL}/comments`);
  const data: ApiResponse<CommentType[]> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch comments");
  }

  return data.data;
}

export async function addComment(
  payload: AddCommentPayload
): Promise<CommentType> {
  const response = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data: ApiResponse<CommentType> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to add comment");
  }

  return data.data;
}

export async function deleteComment(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE",
  });
  const data: ApiResponse<null> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to delete comment");
  }
}
