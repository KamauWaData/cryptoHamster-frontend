
import React, { useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { apiClient } from '@/integrations/client'; // Axios client for Django API

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill | null>(null); // Define the ref
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Handle image upload through the editor
  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.onchange = async () => {
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.type.includes('image/')) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: 'destructive',
      });
      return;
    }
  
    setIsUploading(true);
  
    try {
      // Retrieve the access token
      const accessToken = localStorage.getItem('access_token'); // Retrieve the token from localStorage

      // upload image to Django API
      const formdata = new FormData();
      formdata.append('file', file);
      const response = await apiClient.post('upload/', formdata, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include the access token if required
          'Content-Type': 'multipart/form-data',
        },
      });
      const image_url = response.data.url;

      // Get the Quil editor instance
      const quill = quillRef.current?.getEditor();
      if (quill){
        // Get the current selection or end of content
        const range = quill.getSelection(true);
        const index = range ? range.index : quill.getLength();
        
        // Insert the image at cursor position
        quill.insertEmbed(index, 'image', image_url);
        // Move cursor after image
        quill.setSelection(index + 1, 0);
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.response?.data?.detail || "Could not upload image",
        variant: "destructive",
      });
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };
};

// Quill editor configuration
{/*const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
    handlers: {
      image: () => handleImageUpload(),
    },
  },
}; */}

{/*const formats = [
  'header', // Headers (h1, h2, h3, etc.)
  'bold', 'italic', 'underline', 'strike', // Text formatting
  'blockquote', // Blockquote
  'list', 'bullet', 'indent', // Lists and indentation
  'link', 'image', // Links and images
];*/}
  
  return (
    <div className="space-y-2">
      {isUploading && (
        <div className="flex items-center space-x-2 mb-2 text-trendforge-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading image...</span>
        </div>
      )}
      
      <div className="border rounded-md overflow-hidden">
        <ReactQuill 
          ref={quillRef}
          theme="snow"
          value={value || ''}
          onChange={onChange}
          //modules={modules}
          //formats={formats}
          style={{ minHeight: '200px' }}
          placeholder="Start writing your article content..."
        />
      </div>
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm"
        className="flex items-center space-x-2"
        onClick={handleImageUpload}
      >
        <Upload className="h-4 w-4" />
        <span>Upload Image</span>
      </Button>
      <p className="text-xs text-muted-foreground">
        You can also drag and drop images directly into the editor
      </p>
    </div>
  );
};
    

export default RichTextEditor;
