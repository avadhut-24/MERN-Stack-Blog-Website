import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditPost() {
  const [summary, setSummary] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/post/${id}`).then((response) =>
      response.json().then((postInfo) => {
        setSummary(postInfo.summary);
        setTitle(postInfo.title);
        setContent(postInfo.content);
      })
    );
  }, []);

  async function Edit_Post(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files?.[0]);
    data.set('id', id);
    ev.preventDefault();

    const response = await fetch('http://localhost:5000/post', {
      method: 'PUT',
      body: data,
      credentials: 'include'
    });

    if (response.ok) {
      navigate('/');
    } else {
      alert('unable to update the post');
    }
  }

  return (
    <form onSubmit={Edit_Post}>
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
        theme="snow"
        value={content}
        onChange={(newValue) => setContent(newValue)}
      />
      <button
        type="submit"
        style={{ marginTop: '5px' }}>
        Edit Post
      </button>
    </form>
  );
}
