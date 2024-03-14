import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatISO9075 } from 'date-fns';

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/post/${id}`).then((response) => response.json().then((post) => setPostInfo(post)));
  }, []);

  //   useEffect(() => {
  //     async function fetchData() {
  //       const response = await fetch(`http://localhost:5000/post/${id}`);
  //       const post = response.json();
  //       setPostInfo(post);
  //     }
  //   }, []);

  if (!postInfo) {
    return '';
  }

  var content = postInfo.content;
  var parser = new DOMParser();
  var doc = parser.parseFromString(content, 'text/html');
  var innerHTMLContent = doc.querySelector('p').innerHTML;

  return (
    <div className="post-page">
      <div>
        <h1> {postInfo.title} </h1>
      </div>

      <div className="post-info">
        <time className="postImg"> {formatISO9075(new Date(postInfo.createdAt))} </time>
        <a
          className="postAuth"
          href=" ">
          by @{postInfo.author.username}
        </a>
      </div>
      <div className="editPost">
        <Link
          className="editbtn"
          to={`/edit/${postInfo._id}`}>
          Edit post
        </Link>
      </div>

      <div className="image">
        <img
          src={`http://localhost:5000/${postInfo.cover}`}
          alt="xyz"
        />
      </div>

      <div>{innerHTMLContent}</div>
    </div>
  );
}
