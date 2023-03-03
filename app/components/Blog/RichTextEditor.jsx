import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ content, setContent }) => {
  return (
    <ReactQuill
      value={content}
      onChange={setContent}
      placeholder="Type something..."
      style={{
        height: '20rem',
        marginBottom: '3.5rem',
      }}
      theme="snow"
      id="rich-text-editor"
    />
  );
};

export default RichTextEditor;
