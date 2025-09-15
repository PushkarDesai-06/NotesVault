import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/axios";
import { useAuth } from "../context/AuthContext";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const TagCloud = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotesByTag();
  }, [selectedTag, searchTerm, notes]);

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

  const filterNotesByTag = () => {
    let filtered = notes;

    if (selectedTag) {
      filtered = filtered.filter((note) => note.tags.includes(selectedTag));
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotes(filtered);
  };

  const getAllTags = () => {
    const tagCounts: { [key: string]: number } = {};
    notes.forEach((note) => {
      note.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getTagSize = (count: number, maxCount: number) => {
    const minSize = 0.9;
    const maxSize = 2.0;
    const ratio = count / maxCount;
    return minSize + (maxSize - minSize) * ratio;
  };

  const handleLogout = () => {
    logout();
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading tags...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const allTags = getAllTags();
  const maxCount = Math.max(...allTags.map((t) => t.count), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-2xl font-bold text-gray-900 hover:text-gray-700"
              >
                NotesVault
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-semibold text-gray-700">
                Tag Explorer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Back to Notes
              </Link>
              <span className="text-gray-700">Welcome, {user?.username}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tag Cloud Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tag Cloud</h2>
                <div className="text-sm text-gray-500">
                  {allTags.length} unique tag{allTags.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search tags or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Tag Cloud */}
              {allTags.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">No tags found</div>
                  <p className="text-gray-400 mt-2">
                    Create some notes with tags to see them here!
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedTag("")}
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                      selectedTag === ""
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Tags
                  </button>
                  {allTags.map(({ tag, count }) => {
                    const fontSize = getTagSize(count, maxCount);
                    const isSelected = selectedTag === tag;

                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(isSelected ? "" : tag)}
                        className={`
                          inline-flex items-center px-4 py-2 rounded-full font-medium
                          transition-all duration-200 hover:scale-105
                          ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          }
                        `}
                        style={{ fontSize: `${fontSize}rem` }}
                        title={`${count} note${
                          count > 1 ? "s" : ""
                        } with this tag`}
                      >
                        {tag}
                        <span className="ml-2 text-xs opacity-75 bg-black bg-opacity-20 px-2 py-1 rounded-full">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Filtered Notes Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTag ? `Notes tagged "${selectedTag}"` : "All Notes"}
                </h3>
                <span className="text-sm text-gray-500">
                  {filteredNotes.length} note
                  {filteredNotes.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      {selectedTag
                        ? "No notes with this tag"
                        : "No notes found"}
                    </div>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/edit?id=${note.id}`)}
                    >
                      <h4 className="font-medium text-gray-900 mb-2 truncate">
                        {note.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        {truncateContent(note.content)}
                      </p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {note.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-gray-400">
                        {formatDate(note.updatedAt)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {selectedTag && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={() => setSelectedTag("")}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
