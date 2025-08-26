import React, { useState } from 'react';
import { backend } from 'declarations/backend';
import { FiUpload, FiFile, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DocumentUpload = ({ userPrincipal, onFactsExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedFacts, setExtractedFacts] = useState([]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!userPrincipal) {
      toast.error('Please connect your wallet first');
      return;
    }

    // Check file type
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.txt')) {
      toast.error('Please upload a text file, PDF, or Word document');
      return;
    }

    setIsProcessing(true);
    setUploadedFile(file);
    const loadingToast = toast.loading('Processing document...');

    try {
      // Read file content
      const fileContent = await readFileContent(file);
      
      // Determine document type
      const documentType = determineDocumentType(file.name, fileContent);
      
      // Process document with backend
      const result = await backend.process_document(fileContent, documentType);
      
      if (result.Ok) {
        const facts = result.Ok;
        setExtractedFacts(facts);
        toast.success(`Extracted ${facts.length} facts from your document!`, { id: loadingToast });
        
        // Notify parent component
        if (onFactsExtracted) {
          onFactsExtracted(facts);
        }
      } else {
        toast.error('Failed to process document', { id: loadingToast });
      }
    } catch (error) {
      console.error('Document processing error:', error);
      toast.error('Error processing document', { id: loadingToast });
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const determineDocumentType = (fileName, content) => {
    const nameLower = fileName.toLowerCase();
    const contentLower = content.toLowerCase();
    
    if (nameLower.includes('resume') || nameLower.includes('cv') || 
        contentLower.includes('experience') || contentLower.includes('education') || 
        contentLower.includes('skills')) {
      return 'resume';
    }
    
    if (nameLower.includes('profile') || contentLower.includes('about me') || 
        contentLower.includes('personal information')) {
      return 'profile';
    }
    
    return 'text';
  };

  const getFactTypeColor = (factType) => {
    const colors = {
      PersonalInfo: 'bg-blue-50 text-blue-800 border-blue-200',
      Preference: 'bg-red-50 text-red-800 border-red-200',
      Goal: 'bg-green-50 text-green-800 border-green-200',
      Relationship: 'bg-purple-50 text-purple-800 border-purple-200',
      Experience: 'bg-orange-50 text-orange-800 border-orange-200',
      Knowledge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    };
    return colors[factType] || 'bg-gray-50 text-gray-800 border-gray-200';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent mb-2">
          Document Upload
        </h2>
        <p className="text-gray-600">
          Upload your resume, profile, or any document containing personal information to automatically extract and remember key facts.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : isProcessing
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <FiLoader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">Processing Document...</p>
            <p className="text-sm text-gray-500">Extracting personal information and facts</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FiUpload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your document here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports: PDF, Word documents, and text files
            </p>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".txt,.pdf,.doc,.docx"
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload"
              className="bg-gradient-to-r from-red-500 to-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:from-red-600 hover:to-blue-700 transition-all"
            >
              Choose File
            </label>
          </div>
        )}
      </div>

      {/* Uploaded File Info */}
      {uploadedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <FiFile className="text-blue-500" />
            <div className="flex-1">
              <p className="font-medium text-gray-700">{uploadedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            {!isProcessing && (
              <FiCheck className="text-green-500" />
            )}
          </div>
        </div>
      )}

      {/* Extracted Facts */}
      {extractedFacts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Extracted Information ({extractedFacts.length} facts)
          </h3>
          <div className="space-y-3">
            {extractedFacts.map((fact, index) => (
              <div
                key={index}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getFactTypeColor(fact.fact_type)}`}>
                    {fact.fact_type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Confidence: {Math.round(fact.confidence * 100)}%
                    </span>
                    {fact.should_remember && (
                      <FiCheck className="w-4 h-4 text-green-500" title="Will be remembered" />
                    )}
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {fact.fact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Tips for better extraction:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use clear section headers like "Experience", "Education", "Skills"</li>
          <li>• Include personal details like name, location, and contact information</li>
          <li>• Mention your goals, preferences, and interests explicitly</li>
          <li>• Use structured formats for better recognition</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUpload;
