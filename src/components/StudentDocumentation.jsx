"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "../lib/api";
import { uploadToCloudinary, schoolImage } from "../lib/cloudinary";

export function StudentDocumentation({ studentId }) {
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await apiRequest("/api/student/documents");
      setDocuments(response.data || []);
      setStats(response.stats);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // Preview file before upload
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    
    // Create preview for images
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedDocType) {
      alert("Please select a document type and file");
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF, JPG, JPEG, and PNG files are allowed");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload to Cloudinary
      const folder = `students/${studentId}/documents`;
      const cloudinaryResult = await uploadToCloudinary(selectedFile, folder);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Save document reference to backend
      const response = await apiRequest("/api/student/documents/upload", {
        method: "POST",
        body: JSON.stringify({
          documentType: selectedDocType,
          documentName: selectedFile.name,
          documentUrl: cloudinaryResult.secure_url,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          cloudinaryPublicId: cloudinaryResult.public_id
        })
      });
      
      if (response.success) {
        alert("✅ Document uploaded successfully! It will be verified by school administration.");
        fetchDocuments();
        setSelectedFile(null);
        setSelectedDocType("");
        setPreviewUrl(null);
        document.getElementById("fileInput").value = "";
        setUploadProgress(0);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    } finally {
      setUploading(false);
      clearInterval(window.progressInterval);
    }
  };

  const handleDelete = async (docId, cloudinaryPublicId) => {
    if (confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      try {
        // Delete from backend (which will also handle Cloudinary deletion)
        const response = await apiRequest(`/api/student/documents/${docId}`, {
          method: "DELETE"
        });
        
        if (response.success) {
          alert("Document deleted successfully");
          fetchDocuments();
        }
      } catch (error) {
        alert("Delete failed: " + error.message);
      }
    }
  };

  const getFileIcon = (fileType, documentName) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('image')) return '🖼️';
    if (documentName?.includes('.doc')) return '📝';
    return '📎';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your documents...</p>
      </div>
    );
  }

  return (
    <div className="documentation-section max-w-4xl mx-auto">
      {/* Progress Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span>📊</span> Documentation Progress
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{ width: `${stats?.completion_percentage || 0}%` }}
              />
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-600">
            {stats?.completion_percentage || 0}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div className="bg-white/50 rounded-lg p-2">
            <p className="text-sm text-gray-600">Required</p>
            <p className="text-xl font-bold">{stats?.total_required || 0}</p>
          </div>
          <div className="bg-white/50 rounded-lg p-2">
            <p className="text-sm text-gray-600">Uploaded</p>
            <p className="text-xl font-bold text-green-600">{stats?.uploaded || 0}</p>
          </div>
          <div className="bg-white/50 rounded-lg p-2">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-xl font-bold text-orange-600">{stats?.pending || 0}</p>
          </div>
        </div>
        {stats?.is_complete && (
          <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-center">
            🎉 Congratulations! All required documents have been uploaded and verified.
          </div>
        )}
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📤</span> Upload New Document
        </h3>
        <form onSubmit={handleFileUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Document Type *</label>
            <select 
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select document type</option>
              {documents.filter(doc => !doc.document_url && doc.is_required).map((doc) => (
                <option key={doc.document_type} value={doc.document_type}>
                  {doc.document_type_name} (Required)
                </option>
              ))}
              {documents.filter(doc => !doc.document_url && !doc.is_required).map((doc) => (
                <option key={doc.document_type} value={doc.document_type}>
                  {doc.document_type_name} (Optional)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">File *</label>
            <input
              id="fileInput"
              type="file"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB)
            </p>
          </div>

          {/* File Preview */}
          {previewUrl && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img src={previewUrl} alt="Preview" className="max-h-32 rounded-lg" />
            </div>
          )}

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading to cloud...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={uploading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                📤 Upload Document
              </>
            )}
          </button>
        </form>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>📁</span> Uploaded Documents
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {documents.filter(doc => doc.document_url).map((doc) => (
            <div key={doc.id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">
                      {getFileIcon(doc.file_type, doc.document_name)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{doc.document_type_name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{doc.document_name}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                          doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {doc.status === 'verified' ? '✓ Verified' : 
                           doc.status === 'rejected' ? '✗ Rejected' : 
                           '⏳ Pending Verification'}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <span>📅</span> {new Date(doc.uploaded_at).toLocaleDateString()}
                        </span>
                        {doc.file_size && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <span>💾</span> {(doc.file_size / 1024).toFixed(2)} KB
                          </span>
                        )}
                      </div>
                      {doc.remarks && (
                        <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-sm text-red-700">📝 {doc.remarks}</p>
                        </div>
                      )}
                      {doc.verified_at && doc.status === 'verified' && (
                        <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                          <span>✅</span> Verified on {new Date(doc.verified_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {doc.document_url && (
                    <a 
                      href={doc.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition inline-flex items-center gap-1"
                    >
                      👁️ View
                    </a>
                  )}
                  {doc.status !== 'verified' && (
                    <button
                      onClick={() => handleDelete(doc.id, doc.cloudinary_public_id)}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition inline-flex items-center gap-1"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {documents.filter(doc => doc.document_url).length === 0 && (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📂</div>
              <p className="text-gray-500 font-medium">No documents uploaded yet.</p>
              <p className="text-sm text-gray-400 mt-1">Please upload the required documents above.</p>
            </div>
          )}
        </div>
      </div>

      {/* Required Documents Checklist */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">
          <span>📋</span> Required Documents Checklist
        </h3>
        <div className="space-y-2">
          {documents.map((doc) => (
            <div key={doc.document_type} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 transition">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                doc.document_url ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {doc.document_url && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`flex-1 ${doc.document_url ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                {doc.document_type_name}
                {doc.is_required && <span className="text-red-500 ml-1">*</span>}
              </span>
              {doc.document_url && doc.status === 'verified' && (
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Verified</span>
              )}
              {doc.document_url && doc.status === 'pending' && (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
              )}
              {doc.document_url && doc.status === 'rejected' && (
                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Re-upload needed</span>
              )}
              {!doc.document_url && doc.is_required && (
                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">Missing</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>ℹ️ Important Note:</strong> Required documents (<span className="text-red-500">*</span>) must be uploaded and verified before your admission is complete.
          </p>
          <p className="text-xs text-yellow-700 mt-2">
            Documents are typically verified within 2-3 business days. You will be notified once verified.
          </p>
        </div>
      </div>
    </div>
  );
}