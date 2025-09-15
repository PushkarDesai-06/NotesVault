import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { api } from "../lib/axios";

export const NoteEdit = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get("id");

  useEffect(() => {
    if (noteId) {
      setIsEditMode(true);
      fetchNote(noteId);
    }
  }, [noteId]);

  const fetchNote = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/notes/${id}`);

      const note = response.data;
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags.join(", "));
    } catch (error) {
      console.error("Error fetching note:", error);
      setError("Failed to load note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      setIsLoading(false);
      return;
    }

    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      };

      if (isEditMode && noteId) {
        await api.put(`/api/notes/${noteId}`, noteData);
      } else {
        await api.post("/api/notes", noteData);
      }

      navigate("/");
    } catch (error: any) {
      console.error("Error saving note:", error);
      setError(error.response?.data?.message || "Failed to save note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !noteId ||
      !window.confirm("Are you sure you want to delete this note?")
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await api.delete(`/api/notes/${noteId}`);
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting note:", error);
      setError(error.response?.data?.message || "Failed to delete note");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading note...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Note" : "Create New Note"}
          </h1>
          <div className="flex space-x-4">
            {isEditMode && (
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            )}
            <Link
              to="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 no-underline"
            >
              Back to Home
            </Link>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 space-y-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              placeholder="Enter note title..."
              className="w-full px-3 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              placeholder="Write your note content here..."
              rows={15}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={isLoading}
              placeholder="tag1, tag2, tag3..."
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Update Note"
                : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
