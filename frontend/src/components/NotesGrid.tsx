import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/axios";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const NotesGrid = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/notes");
      setNotes(response.data);
    } catch (error: any) {
      console.error("Error fetching notes:", error);
      setError("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  // Get all unique tags from notes
  const allTags = [...new Set(notes.flatMap((note) => note.tags))].sort();

  // Filter notes based on search term and selected tag
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchTerm === "" ||
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === "" || note.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-gray-600">Loading your notes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md inline-block mb-4">
          {error}
        </div>
        <div>
          <button
            onClick={fetchNotes}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Notes Yet</h2>
        <p className="text-gray-600 mb-6">Start creating your first note!</p>
        <Link
          to="/edit"
          className="inline-block px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 no-underline"
        >
          Create Your First Note
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search notes by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tag Filter */}
          <div className="sm:w-48">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedTag) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Info */}
        {(searchTerm || selectedTag) && (
          <div className="text-sm text-gray-600">
            Showing {filteredNotes.length} of {notes.length} notes
            {searchTerm && <span> matching "{searchTerm}"</span>}
            {selectedTag && <span> tagged with "{selectedTag}"</span>}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Notes ({filteredNotes.length})
        </h2>
        <Link
          to="/edit"
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 no-underline"
        >
          + New Note
        </Link>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            {notes.length === 0 ? "No notes yet" : "No notes match your search"}
          </div>
          {notes.length === 0 ? (
            <p className="text-gray-400">
              Create your first note to get started!
            </p>
          ) : (
            <p className="text-gray-400">
              Try adjusting your search terms or filters
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
                  {note.title}
                </h3>
                <p className="text-gray-600 leading-relaxed min-h-[60px]">
                  {truncateContent(note.content)}
                </p>
              </div>

              {note.tags.length > 0 && (
                <div className="mb-4">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm mr-2 mb-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <small className="text-gray-500 text-sm">
                  {formatDate(note.updatedAt)}
                </small>
                <Link
                  to={`/edit?id=${note.id}`}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 no-underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
