// root/frontend/app/component/QuillEditor.js

import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Ensure this CSS import is correct

const QuillEditor = ({ setContent }) => {
  const editorRef = useRef(null); // Reference to the div where Quill will be instantiated

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow', // Use snow theme for better styling
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean']
            ],
        },
      });

      // Listen for text change events to update the parent component's state
      quill.on('text-change', () => {
        const html = editorRef.current.querySelector('.ql-editor').innerHTML;
        setContent(html);
      });
    }
  }, [setContent]);

  // Ensure editor styling is sufficient for visibility and usability
  return (
    <div style={{ minHeight: '100px', maxHeight: '400px', overflow:'auto' }}> {/* Adjust height as necessary */}
      <div ref={editorRef} />
    </div>
  );
};

export default QuillEditor;
