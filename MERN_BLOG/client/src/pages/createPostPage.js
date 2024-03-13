import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [summary, setSummary] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const navigate = useNavigate();

  async function CreateNewPost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    ev.preventDefault();
    const response = await fetch('http://localhost:5000/post', {
      method: 'POST',
      body: data,
      credentials: 'include'
    });

    if (response.ok) {
      navigate('/');
    } else {
      alert('Unable to Create Post');
    }
  }

  return (
    <form onSubmit={CreateNewPost}>
      <input
        type="text"
        placeholder={'title'}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="text"
        placeholder={'summary'}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input
        type="file"
        onChange={(ev) => setFiles(ev.target.files)}
      />
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
      />
      <button
        type="submit"
        style={{ marginTop: '5px' }}>
        Create Post
      </button>
    </form>
  );
}
